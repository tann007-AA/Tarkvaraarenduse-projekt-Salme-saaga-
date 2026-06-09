import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { randomUUID } from 'node:crypto';
import { DRIZZLE } from '../db/db.module';
import { users } from '../db/schema/users.schema';
import { sessions } from '../db/schema/sessions.schema';
import { hashPassword, verifyPassword } from './password.util';
import { signAuthToken, generateRefreshToken } from './token.util';

type RegisterInput = {
  email: string;
  username: string;
  name: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type SessionMetadata = {
  userAgent?: string;
  ipAddress?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: MySql2Database,
    private readonly configService: ConfigService,
  ) {}

  // Kasutaja registreerimine + sessiooni loomine
  async register(input: RegisterInput, metadata?: SessionMetadata) {
    const normalizedEmail = this.validateAndNormalizeEmail(input.email);
    this.validatePassword(input.password);

    // Kontrollime, kas email on juba kasutusel
    const [existingUser] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      throw new ConflictException('E-mail on juba kasutuses.');
    }

    const passwordHash = await hashPassword(input.password);
    const id = randomUUID();

    try {
      // Loome uue kasutaja andmebaasi
      await this.db.insert(users).values({
        id,
        username: input.username,
        name: input.name,
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        lastLoginAt: new Date(),
      });
    } catch (error) {
      if (this.isDuplicateEntryError(error)) {
        throw new ConflictException(
          'E-mail või kasutajanimi on juba kasutuses.',
        );
      }

      throw new InternalServerErrorException(
        'Kasutaja loomine ebaõnnestus. Kontrolli andmebaasi migratsioone.',
      );
    }

    // Loome sessiooni (access + refresh token)
    return this.createSession({ id, email: normalizedEmail }, false, metadata);
  }

  // Sisselogimine
  async login(input: LoginInput, metadata?: SessionMetadata) {
    const normalizedEmail = this.validateAndNormalizeEmail(input.email);

    // Leiame kasutaja emaili järgi
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      throw new UnauthorizedException('Vale parool või e-mail.');
    }

    // Kontrollime parooli
    const isValidPassword = await verifyPassword(
      input.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Vale parool või e-mail.');
    }

    // Uuendame viimase sisselogimise aega
    await this.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Loome uue sessiooni
    return this.createSession(
      { id: user.id, email: user.email },
      input.rememberMe || false,
      metadata,
    );
  }

  // Tagastab hetkel sisse logitud kasutaja
  async me(userId: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new UnauthorizedException('Kasutajat ei eksisteeri.');
    }

    return user;
  }

  // Logib kasutaja välja (üks või kõik sessioonid)
  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.db.delete(sessions).where(eq(sessions.id, sessionId));
    } else {
      await this.db.delete(sessions).where(eq(sessions.userId, userId));
    }

    return { message: 'Välja logitud.' };
  }

  // Logib välja kõigist seadmetest
  async logoutAll(userId: string) {
    await this.db.delete(sessions).where(eq(sessions.userId, userId));
    return { message: 'Kõikidest seansidest välja logitud.' };
  }

  // Refresh tokeni abil uue access tokeni loomine
  async refreshToken(refreshToken: string) {
    const refreshTokenHash = await hashPassword(refreshToken);

    const [session] = await this.db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
        rememberMe: sessions.rememberMe,
      })
      .from(sessions)
      .where(eq(sessions.refreshTokenHash, refreshTokenHash));

    if (!session) {
      throw new UnauthorizedException('Kehtetu värskendustoken.');
    }

    // Kontrollime kas sessioon on aegunud
    if (new Date(session.expiresAt) < new Date()) {
      await this.db.delete(sessions).where(eq(sessions.id, session.id));
      throw new UnauthorizedException('Seanss on aegunud.');
    }

    const [user] = await this.db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, session.userId));

    if (!user) {
      throw new UnauthorizedException('Kasutajat ei eksisteeri.');
    }

    // Genereerime uue access tokeni
    const accessTokenJti = randomUUID();
    const accessToken = this.generateAccessToken(
      user,
      accessTokenJti,
      session.rememberMe || false,
    );

    // Uuendame sessiooni infot
    await this.db
      .update(sessions)
      .set({
        accessTokenJti,
        lastActivityAt: new Date(),
      })
      .where(eq(sessions.id, session.id));

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  // Kontrollib kas sessioon on kehtiv
  async validateSession(userId: string, jti: string): Promise<boolean> {
    const result = await this.db
      .select({ id: sessions.id })
      .from(sessions)
      .where(
        and(eq(sessions.userId, userId), eq(sessions.accessTokenJti, jti)),
      );

    return result.length > 0;
  }

  // Tagastab kasutaja sessioonid
  async getUserSessions(userId: string) {
    return this.db
      .select({
        id: sessions.id,
        userAgent: sessions.userAgent,
        ipAddress: sessions.ipAddress,
        rememberMe: sessions.rememberMe,
        lastActivityAt: sessions.lastActivityAt,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId));
  }

  // Sessiooni loomine (access + refresh token)
  private async createSession(
    user: { id: string; email: string },
    rememberMe: boolean,
    metadata?: SessionMetadata,
  ) {
    const sessionId = randomUUID();
    const accessTokenJti = randomUUID();
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = await hashPassword(refreshToken);

    const accessToken = this.generateAccessToken(
      user,
      accessTokenJti,
      rememberMe,
    );

    // Sessiooni kestus
    const expirationDays = rememberMe ? 30 : 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    // Salvestame sessiooni andmebaasi
    await this.db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      accessTokenJti,
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress,
      rememberMe,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: rememberMe ? 2592000 : 604800,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  // Access tokeni genereerimine
  private generateAccessToken(
    user: { id: string; email: string },
    jti: string,
    rememberMe: boolean,
  ): string {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new BadRequestException('JWT_SECRET ei ole seadistatud');
    }

    // Tokeni kehtivus (15 min või 1h)
    const expiresInSeconds = rememberMe ? 3600 : 900;

    return signAuthToken(
      {
        sub: user.id,
        email: user.email,
        jti,
      },
      jwtSecret,
      expiresInSeconds,
    );
  }

  // Emaili valideerimine
  private validateAndNormalizeEmail(email: string) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new BadRequestException('E-mail on kohustuslik.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new BadRequestException('E-mail peab olema korrektne.');
    }

    return normalizedEmail;
  }

  // Parooli valideerimine
  private validatePassword(password: string) {
    if (!password?.trim()) {
      throw new BadRequestException('Parool on kohustuslik.');
    }

    if (password.length < 8) {
      throw new BadRequestException('Parool peab olema vähemalt 8 märki pikk.');
    }
  }

  private isDuplicateEntryError(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ER_DUP_ENTRY'
    );
  }
}

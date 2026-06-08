import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { randomUUID } from 'node:crypto';
import { DRIZZLE } from '../db/db.module';
import { users } from '../db/schema/users.schema';
import { hashPassword, verifyPassword } from './password.util';
import { signAuthToken } from './token.util';

type AuthInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: MySql2Database,
    private readonly configService: ConfigService,
  ) {}

  async register(input: AuthInput) {
    const normalizedEmail = this.validateAndNormalizeEmail(input.email);
    this.validatePassword(input.password);

    const [existingUser] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await hashPassword(input.password);
    const id = randomUUID();

    await this.db.insert(users).values({
      id,
      email: normalizedEmail,
      passwordHash,
    });

    return this.buildAuthResponse({
      id,
      email: normalizedEmail,
    });
  }

  async login(input: AuthInput) {
    const normalizedEmail = this.validateAndNormalizeEmail(input.email);

    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await verifyPassword(
      input.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse({
      id: user.id,
      email: user.email,
    });
  }

  async me(userId: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return user;
  }

  private buildAuthResponse(user: { id: string; email: string }) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new BadRequestException('JWT_SECRET is not configured');
    }

    const expiresInSeconds = Number(
      this.configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '604800',
    );

    const accessToken = signAuthToken(
      {
        sub: user.id,
        email: user.email,
      },
      jwtSecret,
      Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
        ? expiresInSeconds
        : 604800,
    );

    return {
      accessToken,
      user,
    };
  }

  private validateAndNormalizeEmail(email: string) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new BadRequestException('email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new BadRequestException('email must be valid');
    }

    return normalizedEmail;
  }

  private validatePassword(password: string) {
    if (!password?.trim()) {
      throw new BadRequestException('password is required');
    }

    if (password.length < 8) {
      throw new BadRequestException('password must be at least 8 characters');
    }
  }
}

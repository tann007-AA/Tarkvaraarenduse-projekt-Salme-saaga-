import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { verifyAuthToken } from './token.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    // Kontrollime kas Bearer token on olemas
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Puudub autentimistoken');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret puudub');
    }

    try {
      const payload = verifyAuthToken(token, jwtSecret);

      // Kontrollime kas sessioon on kehtiv
      const isValidSession = await this.authService.validateSession(
        payload.sub,
        payload.jti,
      );

      if (!isValidSession) {
        throw new UnauthorizedException('Sessioon on tühistatud');
      }

      // Lisame kasutaja requesti
      request.user = {
        id: payload.sub,
        email: payload.email,
        jti: payload.jti,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Kehtetu või aegunud token');
    }
  }
}

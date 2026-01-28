import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../types/at-payload.type';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not defined');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['refresh_token']; // Nama cookie yang Anda set saat login
          }
          return token;
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true, // Allows us to access the raw refresh token
    });
  }

  validate(req: Request, payload: AccessTokenPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }
    const userId = payload.sub;
    return { ...payload, refreshToken, userId };
  }
}

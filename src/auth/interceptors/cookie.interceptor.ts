import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Cek apakah data return memiliki refreshToken
        if (data && data.refresh_token) {
          const res = context.switchToHttp().getResponse<Response>();

          // Set Cookie
          res.cookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          // Hapus refreshToken dari data agar tidak terkirim di JSON body
          const { refresh_token, ...rest } = data;
          return rest;
        }
        return data;
      }),
    );
  }
}
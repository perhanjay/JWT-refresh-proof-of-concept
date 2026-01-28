import { Controller, UseInterceptors, Req } from '@nestjs/common';
import { Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { CookieInterceptor } from './interceptors/cookie.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(CookieInterceptor)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @UseInterceptors(CookieInterceptor)
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Req() req) {
    const user = req.user;
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(user.sub, refreshToken);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const isSuccess = await this.authService.register(registerDto);
    if(isSuccess) return { success: isSuccess, message: 'Registration success' }
  }
}

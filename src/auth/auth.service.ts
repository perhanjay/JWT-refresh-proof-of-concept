import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { RegisterDto } from './register.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async getTokens(userId: string, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, jti: uuidv4() },
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          expiresIn: parseInt(
            this.configService.getOrThrow<string>('AT_DURATION'),
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, jti: uuidv4() },
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          expiresIn: parseInt(
            this.configService.getOrThrow<string>('AT_DURATION'),
          ),
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatch = await argon2.verify(user.hashedRt, rt);
    console.log(rtMatch);

    if (!rtMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    console.log(tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(userId: string, rt: string) {
    const hash = await argon2.hash(rt);
    await this.usersService.update(userId, {
      hashedRt: hash,
    });
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user: User | null = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User) {
    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async register(user: RegisterDto) {
    const { fullname, username, password } = user;
    const isExist = await this.usersService.findOne(username);
    if (isExist) throw new ConflictException('User already exists');

    const genSalt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, genSalt);

    try {
      await this.usersService.create({
        fullName: fullname,
        username: username,
        password: hashedPass,
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException('Failed, internal server error');
    }
  }
}

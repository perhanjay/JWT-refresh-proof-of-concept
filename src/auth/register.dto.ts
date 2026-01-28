import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty({ message: 'Dilarang Kosong' })
  @MinLength(8)
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

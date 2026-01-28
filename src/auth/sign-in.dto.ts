import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Dilarang Kosong' })
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Dilarang Kosong' })
  password: string;
}

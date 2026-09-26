import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken = '';

  @IsString()
  @IsNotEmpty()
  refreshToken = '';
}

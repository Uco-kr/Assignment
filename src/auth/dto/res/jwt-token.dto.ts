import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtTokenDto {
  @ApiProperty({ description: 'The access token', type: String })
  @IsString()
  @IsNotEmpty()
  accessToken = '';
}

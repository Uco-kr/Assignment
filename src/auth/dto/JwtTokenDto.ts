import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator'; // 👈 추가

export class JwtTokenDto {
  @ApiProperty({ description: 'The access token', type: String })
  @IsString()
  access_token!: string;
}

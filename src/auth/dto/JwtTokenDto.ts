import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtTokenDto {
  @ApiProperty({ description: 'The access token', type: String })
  @IsString()
  accessToken!: string;
}

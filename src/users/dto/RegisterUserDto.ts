import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'name',
    example: '지니어스',
  })
  @IsOptional()
  @IsString()
  name!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'name',
    example: '지니어스',
  })
  @IsString()
  name!: string;
}

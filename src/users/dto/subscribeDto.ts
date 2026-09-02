import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({
    description: 'name',
    example: '지니어스',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'name',
    example: '지니어스',
  })
  @IsString()
  categoryId!: string;
}

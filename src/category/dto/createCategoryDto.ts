import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class createCategoryDto {
  @ApiProperty({
    description: '카테고리의 이름',
    type: String,
    minLength: 1,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  name!: string;
}

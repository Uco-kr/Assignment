import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: '게시글의 제목',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    description: '게시글의 내용',
    type: String,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiProperty({
    type: String,
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  categoryIds!: string[];
}

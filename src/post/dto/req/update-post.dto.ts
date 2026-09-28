import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: '게시글의 제목',
    type: String,
    minLength: 1,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: '게시글의 내용',
    type: String,
    minLength: 1,
    nullable: true,
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  categoryIds?: string[];
}

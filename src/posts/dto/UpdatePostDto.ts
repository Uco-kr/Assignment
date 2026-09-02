import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

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
    description: '게시글의 카테고리의 uuid',
    type: [String],
    isArray: true,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}

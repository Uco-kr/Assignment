import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: '게시글의 제목',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({
    description: '게시글의 내용',
    type: String,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional({
    description: '게시글의 카테고리의 uuid',
    type: [String],
    isArray: true,
    nullable: true,
  })
  @IsString()
  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}

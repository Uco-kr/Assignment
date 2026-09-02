import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class getSubscribedCategoryDto {
  @ApiPropertyOptional({
    description: 'name',
    example: '지니어스',
  })
  @IsOptional()
  @IsString()
  categoryName!: string;

  @ApiPropertyOptional({
    description: 'uuid',
  })
  @IsOptional()
  @IsString()
  categoryUuid!: string;

  @ApiPropertyOptional({
    description: '해당 카테고리의 게시글 갯수',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  postCount!: number;
}

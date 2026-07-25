import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: '게시글의 제목',
    type: String,
    minLength: 1,
    nullable: true,
  })
  title?: string;

  @ApiPropertyOptional({
    description: '게시글의 내용',
    type: String,
    minLength: 1,
    nullable: true,
  })
  content?: string;

  @ApiPropertyOptional({
    description: '게시글의 카테고리의 uuid',
    type: String,
    minLength: 1,
    nullable: true,
  })
  category_id?: string;
}

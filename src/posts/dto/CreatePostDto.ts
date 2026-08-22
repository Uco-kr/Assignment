import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: '게시글의 제목',
    type: String,
    minLength: 1,
    nullable: false,
  })
  title!: string;

  @ApiProperty({
    description: '게시글의 내용',
    type: String,
    minLength: 1,
    nullable: false,
  })
  content!: string;

  @ApiPropertyOptional({
    description: '게시글의 카테고리의 uuid',
    type: String,
    isArray: true,
    nullable: true,
  })
  category_id?: string[];
}

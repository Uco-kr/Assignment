import { ApiProperty } from '@nestjs/swagger';

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
}

import { ApiProperty } from '@nestjs/swagger';

export class getPostCount {
  @ApiProperty({
    description: '카테고리 이름',
    type: String,
    nullable: false,
  })
  CategoryName!: string;

  @ApiProperty({
    description: '카테고리 id',
    type: String,
    nullable: false,
  })
  CategoryUuid!: string;

  @ApiProperty({
    description: '게시물 갯수',
    type: Number,
    nullable: false,
  })
  PostCount!: number;
}

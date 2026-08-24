import { ApiProperty } from '@nestjs/swagger';

export class getPostCount {
  @ApiProperty({
    description: '카테고리 이름',
    type: String,
    nullable: false,
  })
  name!: string;

  @ApiProperty({
    description: '카테고리 id',
    type: String,
    nullable: false,
  })
  uuid!: string;

  @ApiProperty({
    description: '게시물 갯수',
    type: Number,
    nullable: false,
  })
  count!: number;
}

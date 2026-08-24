import { ApiProperty } from '@nestjs/swagger';

export class getUserCount {
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
    description: '사용자 수',
    type: Number,
    nullable: false,
  })
  count!: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class CheckPostNums {
  @ApiProperty({
    description: '게시글의 제목',
    type: String,
    minLength: 1,
    nullable: false,
  })
  category!: string;

  @ApiProperty({
    description: '게시글의 갯수',
    type: Number,
    nullable: false,
  })
  count!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class getPostCount {
  @ApiProperty({
    description: '카테고리 이름',
    type: String,
    nullable: false,
  })
  @IsString()
  categoryName!: string;

  @ApiProperty({
    description: '카테고리 id',
    type: String,
    nullable: false,
  })
  @IsString()
  categoryUuid!: string;

  @ApiProperty({
    description: '게시물 갯수',
    type: Number,
    nullable: false,
  })
  @IsNumber()
  postCount!: number;
}

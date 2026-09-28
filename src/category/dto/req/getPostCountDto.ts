import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPostCountDto {
  @ApiProperty({
    description: '카테고리 이름',
    type: String,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  categoryName!: string;

  @ApiProperty({
    description: '카테고리 id',
    type: String,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  categoryUuid!: string;

  @ApiProperty({
    description: '게시물 갯수',
    type: Number,
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  postCount!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CheckPostNums {
  @ApiProperty({
    description: '게시글의 제목',
    type: String,
    minLength: 1,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  category!: string;

  @ApiProperty({
    description: '게시글의 갯수',
    type: Number,
    nullable: false,
  })
  @IsNumber()
  count!: number;
}

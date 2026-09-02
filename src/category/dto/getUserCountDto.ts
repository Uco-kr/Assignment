import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class getUserCount {
  @ApiProperty({
    description: '카테고리 이름',
    type: String,
    nullable: false,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: '카테고리 id',
    type: String,
    nullable: false,
  })
  @IsString()
  uuid!: string;

  @ApiProperty({
    description: '사용자 수',
    type: Number,
    nullable: false,
  })
  @IsNumber()
  count!: number;
}

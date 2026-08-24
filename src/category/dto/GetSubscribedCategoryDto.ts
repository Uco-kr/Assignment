import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class getSubscribedCategoryDto {
  @ApiProperty({
    description: 'name',
    example: '지니어스',
  })
  @IsOptional()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'uuid',
  })
  @IsOptional()
  @IsString()
  uuid!: string;

  @ApiProperty({
    description: '해당 카테고리의 게시글 갯수',
    type: Number,
  })
  @IsNumber()
  count!: number;
}

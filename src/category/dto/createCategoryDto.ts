import { ApiProperty } from '@nestjs/swagger';

export class createCategoryDto {
  @ApiProperty({
    description: '카테고리의 이름',
    type: String,
    minLength: 1,
    nullable: false,
  })
  name!: string;
}

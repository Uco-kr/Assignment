import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty()
  uuid!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  authorId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  categoryIds!: string[];
}

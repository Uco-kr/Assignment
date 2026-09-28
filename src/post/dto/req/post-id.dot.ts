import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostIdDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  postId!: string;
}

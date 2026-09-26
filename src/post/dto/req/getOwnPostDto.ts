import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetOwnPostDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take!: number;

  @ApiProperty({
    type: Number,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class SetPostCategoriesDto {
  @ApiProperty({ type: [String], isArray: true })
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds!: string[];
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '유저의 id',
    type: String,
    minLength: 1,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  name!: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '유저의 id',
    type: String,
    minLength: 1,
    nullable: true,
  })
  name!: string;
}

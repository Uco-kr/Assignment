import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '유저의 id',
    type: String,
    minLength: 1,
    nullable: true,
  })
  name!: string;

  @ApiPropertyOptional({
    description: '유저의 비밀번호',
    type: String,
    minLength: 8,
    nullable: true,
  })
  password!: string;

  @ApiPropertyOptional({
    description: '유저의 이메일',
    type: String,
    nullable: true,
  })
  email!: string;
}

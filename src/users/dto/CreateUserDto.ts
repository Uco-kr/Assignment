import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '유저의 이름',
    type: String,
    minLength: 1,
    nullable: false,
  })
  name!: string;

  @ApiProperty({
    description: '유저의 비밀번호',
    type: String,
    minLength: 8,
    nullable: false,
  })
  password!: string;

  @ApiProperty({
    description: '유저의 이메일',
    type: String,
    nullable: false,
  })
  email!: string;
}

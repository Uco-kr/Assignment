import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UserInfoDto {
  @IsString()
  name!: string;

  @IsUUID()
  uuid!: string;

  @IsEmail()
  email!: string;
}

import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsString()
  name!: string;

  @IsUUID()
  uuid!: string;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;

  @IsEmail()
  email!: string;
}

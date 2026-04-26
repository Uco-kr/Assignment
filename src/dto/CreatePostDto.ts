import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNumber()
  @IsNotEmpty()
  authorId!: number;
}

import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  authorId!: number;
}

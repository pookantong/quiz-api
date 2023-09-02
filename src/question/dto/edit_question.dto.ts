import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class EditQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  questionId: number

  @IsOptional()
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  choices: string[];

  @IsOptional()
  @IsString()
  correctAnswer: string;

  @IsOptional()
  @IsNumber()
  score: number;
}

import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  choices: string[];

  @IsNotEmpty()
  @IsString()
  correctAnswer: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}

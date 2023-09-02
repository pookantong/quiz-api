import { Type } from 'class-transformer';
import { IsArray, IsEmpty, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from 'src/question/dto/create_question.dto';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

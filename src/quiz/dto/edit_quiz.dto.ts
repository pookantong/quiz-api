import { Type } from 'class-transformer';
import { IsArray, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from 'src/question/dto/create_question.dto';
import { EditQuestionDto } from 'src/question/dto/edit_question.dto';

export class EditQuizDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditQuestionDto)
  questions: EditQuestionDto[];
}

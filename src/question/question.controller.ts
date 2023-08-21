import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { IQuestion } from 'src/common/interfaces/question.interface';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get(':quizId')
  async getQuestion(
    @Param('quizId', ParseIntPipe)
    quizId: number,
    @Query('page', ParseIntPipe)
    page: number,
  ): Promise<IQuestion> {
    return await this.questionService.findQuestionByPage(quizId, page);
  }
}

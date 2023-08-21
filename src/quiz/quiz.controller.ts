import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { QuizService } from './quiz.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IQuiz } from 'src/common/interfaces/quiz.interface';
import { CreateQuizDto } from './dto/create_quiz.dto';
import { CreateQuestionDto } from 'src/question/dto/create_question.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuiz(
    @Query('page', ParseIntPipe)
    page: number,
    @Query('take', ParseIntPipe)
    take: number,
    @GetUser()
    user: User,
  ): Promise<IQuiz[]> {
    return await this.quizService.getQuiz(page, take, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':quizId')
  async checkAnswer(
    @Param('quizId', ParseIntPipe)
    quizId: number,
    @Body()
    data: { answers: string[] },
    @GetUser()
    user: User,
  ) {
    return await this.quizService.checkAnswer(quizId, data.answers, user);
  }

  @Post()
  async createQuiz(
    @Body()
    createQuizDto: CreateQuizDto,
  ) {
    return await this.quizService.createQuiz(createQuizDto);
  }

  @Delete(':id')
  async deleteQuiz(
    @Param('id', ParseIntPipe)
    quizId: number,
  ) {
    return await this.quizService.deleteQuiz(quizId);
  }
}

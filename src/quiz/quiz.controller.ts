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
  Put,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { QuizService } from './quiz.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import {
  IEditorQuiz,
  IJsonQuizzes,
  IQuiz,
} from 'src/common/interfaces/quiz.interface';
import { CreateQuizDto } from './dto/create_quiz.dto';
import { CreateQuestionDto } from 'src/question/dto/create_question.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EditQuizDto } from './dto/edit_quiz.dto';

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
  ): Promise<IJsonQuizzes> {
    return await this.quizService.getQuiz(page, take, user);
  }

  @Get(':quizId')
  async getQuizEditor(
    @Param('quizId', ParseIntPipe)
    quizId: number,
  ): Promise<IEditorQuiz> {
    return await this.quizService.getQuizEditor(quizId);
  }

  @Put(':quizId')
  async editQuiz(
    @Param('quizId', ParseIntPipe)
    quizId: number,
    @Body()
    editQuizDto: EditQuizDto,
  ) {
    return await this.quizService.editQuiz(quizId, editQuizDto);
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

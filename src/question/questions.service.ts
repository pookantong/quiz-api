import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionDto } from './dto/create_question.dto';
import { IQuestion } from 'src/common/interfaces/question.interface';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async findQuestionByPage(quizId, page): Promise<IQuestion> {
    const questions = await this.prisma.question.findMany({
      where: { quizId },
    });
    if (page > questions.length) {
      return null;
    }
    const { id, correctAnswer, ...responseQuestion } = questions[page - 1];
    return responseQuestion;
  }

  async createQuestion(createQuestionDto: CreateQuestionDto, quizId: number) {
    await this.prisma.question.create({
      data: {
        ...createQuestionDto,
        quizId,
      },
    });
  }

  async deleteQuestions(quizId: number) {
    await this.prisma.question.deleteMany({ where: { quizId: quizId } });
  }
}

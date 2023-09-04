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
      select: {
        name: true,
        choices: true,
        score: true,
      },
    });
    console.log(questions);
    const progress = Math.round(((page - 1) / questions.length) * 100);
    const { choices, name, score } = questions[page - 1];
    const shuffleChoices = await this.shuffleArray(choices);
    if (page > questions.length) {
      throw new HttpException('OVERFLOW_PAGE', HttpStatus.BAD_REQUEST);
    }
    return {
      name,
      score,
      choices: shuffleChoices,
      progress,
      maxPage: questions.length,
    };
  }

  async shuffleArray(arr): Promise<string[]> {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

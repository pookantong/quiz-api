import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IQuiz } from 'src/common/interfaces/quiz.interface';
import { IResult } from 'src/common/interfaces/result.interface';
import { CreateQuizDto } from './dto/create_quiz.dto';
import { QuestionService } from 'src/question/questions.service';
import { CreateQuestionDto } from 'src/question/dto/create_question.dto';
import { User } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private questionService: QuestionService,
  ) {}

  async getQuiz(page, take, user): Promise<IQuiz[]> {
    const completedQuizzes = await this.prisma.completedQuiz.findMany({
      where: { user },
    });

    const quizIdsCompleted = new Set(
      completedQuizzes.map((quiz) => quiz.quizId),
    );

    const quizzes = await this.prisma.quiz.findMany({
      take,
      skip: (page - 1) * take,
    });

    const responseQuizzes: IQuiz[] = [];

    //split quiz if completed or been through
    for (const quiz of quizzes) {
      if (quizIdsCompleted.has(quiz.id)) {
        responseQuizzes.push({
          quizId: quiz.id,
          name: quiz.name,
          score: quiz.score,
          completed: true,
        });
      } else {
        responseQuizzes.push({
          quizId: quiz.id,
          name: quiz.name,
          score: quiz.score,
          completed: false,
        });
      }
    }
    return responseQuizzes;
  }

  async checkAnswer(
    quizId: number,
    answers: string[],
    user: User,
  ): Promise<IResult> {
    const questions = await this.prisma.question.findMany({
      where: { quizId },
    });
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });
    const status = [];
    const correctAnswers = [];
    let score = 0;
    for (const [index, answer] of answers.entries()) {
      if (answer === questions[index].correctAnswer) {
        status.push(true);
        score += questions[index].score;
      } else {
        status.push(false);
      }
      correctAnswers.push(questions[index].correctAnswer);
    }
    const completedQuiz = await this.prisma.completedQuiz.findUnique({
      where: {
        userId_quizId: { userId: user.id, quizId },
      },
    });
    if (completedQuiz) {
      if (score > completedQuiz.score) {
        user.score += score - completedQuiz.score;
        await this.prisma.completedQuiz.update({
          where: {
            userId_quizId: { userId: user.id, quizId },
          },
          data: {
            score,
          },
        });
      }
    } else if (score >= quiz.score * 0.7) {
      user.score += score;
      await this.prisma.completedQuiz.create({
        data: {
          quizId,
          userId: user.id,
          score,
        },
      });
    }
    await this.prisma.user.update({
      where: { username: user.username },
      data: {
        score: user.score,
      },
    });
    //dev return interface questions fix
    return {
      questions,
      status,
      correctAnswers,
      score,
    };
  }

  async createQuiz(createQuizDto: CreateQuizDto) {
    const { name, questions } = createQuizDto;
    const quiz = await this.prisma.quiz.create({
      data: {
        name,
        score: 0,
      },
    });
    for (const question of questions) {
      await this.questionService.createQuestion(question, quiz.id);
      quiz.score += question.score;
    }
    await this.prisma.quiz.update({
      where: { id: quiz.id },
      data: { score: quiz.score },
    });
    throw new HttpException('CREATE_SUCCESS', HttpStatus.OK);
  }

  async addQuestion(questions: CreateQuestionDto[], quizId: number) {
    // if not quiz
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    for (const question of questions) {
      await this.questionService.createQuestion(question, quizId);
      quiz.score += question.score;
    }
    throw new HttpException('ADD_SUCCESS', HttpStatus.OK);
  }

  async deleteQuiz(quizId: number) {
    await this.questionService.deleteQuestions(quizId);
    await this.prisma.quiz.delete({ where: { id: quizId } });
    throw new HttpException('DELETE_SUCCESS', HttpStatus.OK);
  }
}

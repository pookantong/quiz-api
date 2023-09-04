import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  IEditorQuiz,
  IJsonQuizzes,
  IQuiz,
} from 'src/common/interfaces/quiz.interface';
import { IResult } from 'src/common/interfaces/result.interface';
import { CreateQuizDto } from './dto/create_quiz.dto';
import { QuestionService } from 'src/question/questions.service';
import { CreateQuestionDto } from 'src/question/dto/create_question.dto';
import { User } from '@prisma/client';

import { EditQuizDto } from './dto/edit_quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private questionService: QuestionService,
  ) {}

  async getQuiz(page, take, user): Promise<IJsonQuizzes> {
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
    const maxPage = Math.ceil(
      (await this.prisma.quiz.findMany()).length / take,
    );

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
    return { quizzes: responseQuizzes, maxPage };
  }

  async checkAnswer(
    quizId: number,
    answers: string[],
    user: User,
  ): Promise<IResult> {
    const questions = await this.prisma.question.findMany({
      where: { quizId },
      select: {
        name: true,
        correctAnswer: true,
        score: true,
      },
    });
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });
    const status = [];
    let score = 0;
    for (const [index, answer] of answers.entries()) {
      if (answer === questions[index].correctAnswer) {
        status.push(true);
        score += questions[index].score;
      } else {
        status.push(false);
      }
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
    return {
      questions,
      status,
      score,
    };
  }

  async createQuiz(createQuizDto: CreateQuizDto) {
    const { name, questions, score } = createQuizDto;
    const quiz = await this.prisma.quiz.create({
      data: {
        name,
        score,
      },
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

  async getQuizEditor(quizId: number): Promise<IEditorQuiz> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    const questions = await this.prisma.question.findMany({
      where: { quizId },
    });
    return {
      quiz,
      questions,
    };
  }

  async editQuiz(quizId: number, editQuizDto: EditQuizDto) {
    const { questions, ...updatedQuiz } = editQuizDto;
    await this.prisma.quiz.update({
      where: { id: quizId },
      data: { ...updatedQuiz },
    });
    for (const question of questions) {
      const { questionId, ...updatedQuestion } = question;
      await this.prisma.question.update({
        where: { id: questionId },
        data: { ...updatedQuestion },
      });
    }
  }
}

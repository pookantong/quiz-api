import { Question, Quiz } from '@prisma/client';

export interface IQuiz {
  quizId: number;
  name: string;
  score: number;
  completed: boolean;
}

export interface IEditorQuiz {
  quiz: Quiz;
  questions: Question[];
}

export interface IJsonQuizzes {
  quizzes: IQuiz[];
  maxPage: Number;
}

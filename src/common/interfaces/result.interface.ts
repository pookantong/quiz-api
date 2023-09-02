import { Question } from "@prisma/client";

interface IResultQuestion {
  name: string;
  correctAnswer: string
  score: number;
}

export interface IResult {
  questions: IResultQuestion[]
  status: Boolean[]
  score: Number
}
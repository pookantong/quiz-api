import { Question } from "@prisma/client";

export interface IResult {
  questions: Question[]
  status: Boolean[]
  correctAnswers: String[]
  score: Number
}
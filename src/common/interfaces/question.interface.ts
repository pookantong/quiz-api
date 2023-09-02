import { Question } from "@prisma/client"

export interface IQuestion {            
  name: string
  choices: string[]
  score: number
  progress: number
  maxPage: number
}

export class IJSONQuestion{
  question: IQuestion
}
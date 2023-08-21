import { Role, User } from "@prisma/client";

export interface IUser{
  email: string;
  username: string;
  score: number
}
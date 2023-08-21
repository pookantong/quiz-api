import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from 'prisma/prisma.module';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [PrismaModule, QuestionModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

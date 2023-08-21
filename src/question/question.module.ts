import { Module } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { QuestionController } from './question.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuestionService],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}

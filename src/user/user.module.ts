import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';



@Module({
  imports: [PrismaModule],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

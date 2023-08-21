import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signUp.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: SignUpDto) {
    const { username, email, password } = createUserDto;
    if (username === (await this.findByUsername(username))?.username) {
      throw new HttpException(
        'USERNAME_IS_ALREADY_IN_USE',
        HttpStatus.CONFLICT,
      );
    } else if (email === (await this.findByEmail(email))?.email) {
      throw new HttpException('EMAIL_IS_ALREADY_IN_USE', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async getUser(user: User):Promise<IUser>{
    return {
      email: user.email,
      username: user.username,
      score: user.score
    }
  }

  async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
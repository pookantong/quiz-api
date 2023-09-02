import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long.' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long.' })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
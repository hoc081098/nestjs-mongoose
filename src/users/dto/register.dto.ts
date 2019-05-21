import { MinLength, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @MinLength(3)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;
}

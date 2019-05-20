import { Controller, Get, Post, Body, HttpStatus, HttpCode, HttpException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmail, MinLength } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';

class GetUserDto {
  readonly id: string;
  readonly username: string;
  readonly email: string;
}

// tslint:disable-next-line: max-classes-per-file
class RegisterUserDto {
  @MinLength(3)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;
}

// tslint:disable-next-line: max-classes-per-file
class LoginUserDto {
  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;
}

// tslint:disable-next-line: max-classes-per-file
@Controller('users')
export class UsersController {

  constructor(
    private readonly userService: UsersService,
  ) { }

  @Get()
  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userService.findAll();
    return users.map(user => {
      return {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      };
    });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto): Promise<any> {
    const { email, password } = body;

    const user = await this.userService.findByEmail(email, password);
    if (user === 'NOT_FOUND') {
      throw new HttpException(
        `User with email '${email}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (user === 'INCORRECT_PASSWORD') {
      throw new HttpException(
        `Incorrect password`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    console.log({ user, body });
    return user;
  }

  @Post('register')
  register(@Body() user: RegisterUserDto) {
    return this.userService.create(user);
  }

  @Get('hello')
  @UseGuards(AuthGuard())
  testAuth() {
    return 'hello world';
  }
}

import { Controller, Get, Post, Body, HttpStatus, HttpCode, HttpException, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Usr as User } from './user.decorator';
import { UserEntity } from './user.entity';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';

@Controller('users')
export class UsersController {

  constructor(
    private readonly userService: UsersService,
  ) { }

  @Get()
  async findAll() {
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
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;

    const user = await this.userService.login(email, password);
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
    return user;
  }

  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    const { username, email, password } = user;
    const createdUser = await this.userService.register(email, username, password);

    if (createdUser === 'ACCOUNT_EXISTS') {
      throw new HttpException(
        `Email ${email} has been registered`,
        HttpStatus.CONFLICT,
      );
    }

    return createdUser;
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  async testAuth(@User() user: UserEntity, @Body() body: UpdateUserDto) {
    const result = await this.userService.update(user.id, body.username, body.oldPassword, body.newPassword);

    if (result === 'INCORRECT_OLD_PASSWORD') {
      throw new HttpException(
        `Old password not match`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (result === 'USER_NOT_FOUND') {
      throw new HttpException(
        `User not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }
}

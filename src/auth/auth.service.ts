import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
  ) { }

  validateUser(payload: JwtPayload): Promise<UserEntity | undefined> {
    return this.userService.findById(payload.id);
  }
}

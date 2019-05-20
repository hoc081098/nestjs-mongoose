import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  validateUser(payload: JwtPayload): UserEntity | undefined | null {
    throw new Error("Method not implemented.");
  }

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }
}

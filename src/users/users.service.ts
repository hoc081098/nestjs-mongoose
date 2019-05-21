import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, UpdateResult, DeleteResult, ObjectID } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import constants from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) { }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return 'NOT_FOUND';
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return 'INCORRECT_PASSWORD';
    }

    const jwtPayload: JwtPayload = {
      id: user.id.toString(),
      email: user.email,
    };
    const token = await this.jwtService.signAsync(jwtPayload);

    return {
      user,
      expiresIn: constants.expiresIn,
      token,
    };
  }

  findById(id: string | ObjectID): Promise<UserEntity | undefined> {
    return this.userRepository.findOne(id);
  }

  async register(email: string, username: string, password: string) {
    if (await this.userRepository.findOne({ email })) {
      return 'ACCOUNT_EXISTS';
    }
    const hashedPassword = await bcrypt.hash(password, 13);
    return await this.userRepository.save({ email, username, password: hashedPassword });
  }

  async update(
    id: ObjectID,
    username?: string,
    oldPassword?: string,
    newPassword?: string,
  ) {
    const user = await this.findById(id);
    if (!user) {
      return 'USER_NOT_FOUND';
    }

    if (username) {
      user.username = username;
    }
    if (newPassword && oldPassword) {
      if (await bcrypt.compare(oldPassword, user.password)) {
        user.password = await bcrypt.hash(newPassword, 13);
      } else {
        return 'INCORRECT_OLD_PASSWORD';
      }
    }

    return this.userRepository.save(user);
  }

  delete(id: ObjectID): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}

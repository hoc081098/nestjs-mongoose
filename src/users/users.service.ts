import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, UpdateResult, DeleteResult, ObjectID } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string, password: string): Promise<UserEntity | 'NOT_FOUND' | 'INCORRECT_PASSWORD'> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return 'NOT_FOUND';
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return 'INCORRECT_PASSWORD';
    }
    return user;
  }

  create(user: DeepPartial<UserEntity>): UserEntity {
    return this.userRepository.create(user);
  }

  update(user: UserEntity): Promise<UpdateResult> {
    return this.userRepository.update(user.id, user);
  }

  delete(id: ObjectID): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}

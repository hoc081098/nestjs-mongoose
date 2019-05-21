import { MinLength } from 'class-validator';

export class UpdateUserDto {
  @MinLength(3)
  readonly username?: string;

  @MinLength(6)
  readonly newPassword?: string;

  @MinLength(6)
  readonly oldPassword?: string;
}

import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
}

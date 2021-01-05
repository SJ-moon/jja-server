import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@app/user/user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.auth, {
    cascade: ['remove', 'update'],
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column()
  password: string;

  @Column()
  salt: string;
}

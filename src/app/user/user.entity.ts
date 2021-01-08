import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Auth } from '@app/auth/auth.entity';
import { OmitType } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}

export class UserWithoutAuth extends OmitType(User, ['auth'] as const) {}

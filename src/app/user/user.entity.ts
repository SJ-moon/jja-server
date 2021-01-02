import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Auth } from '@app/auth/auth.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}

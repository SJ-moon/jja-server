import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/user/user.entity';
import { createUserDto } from '@type/user/user.dto';
import { AuthService } from '@app/auth/auth.service';
import { generalUserResponse } from '@type/user/user.resp';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      relations: ['auth'],
      where: (qb) => {
        qb.where({
          email: email,
        });
      },
    });
  }

  async create(createUserDto: createUserDto): Promise<generalUserResponse> {
    const { password, ...userDto } = createUserDto;
    let user = await this.userRepository.create(userDto);
    user = await this.userRepository.save(user);
    const createAuthDto = {
      password,
      user: user,
    };
    await this.authService.create(createAuthDto);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(userEmail: string): Promise<User> {
    let my_result = await this.userRepository.findOne({ email: userEmail });
    return await this.userRepository.findOne({ email: userEmail });
  }

  async deleteUser(userEmail: string): Promise<User> {
    let user = await this.userRepository.findOne({ email: userEmail });
    await this.authService.delete(user);
    await this.userRepository.delete({ email: userEmail });
    return user;
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserWithoutAuth } from '@app/user/user.entity';
import { AuthService } from '@app/auth/auth.service';
import { createUserDto, updateUserDto } from '@type/user/user.dto';
import { createOrUpdateAuthDto } from '@type/auth/auth.dto';

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

  async create(createUserDto: createUserDto): Promise<UserWithoutAuth> {
    const { password, provider, ...userDto } = createUserDto;
    let user = await this.userRepository.create(userDto);
    user = await this.userRepository.save(user);
    const createAuthDto: createOrUpdateAuthDto = {
      password,
      user: user,
      provider: provider,
    };
    await this.authService.create(createAuthDto);
    return user;
  }

  async update(
    user: User,
    updateUserDto: updateUserDto,
  ): Promise<UserWithoutAuth> {
    const { password, ...userDto } = updateUserDto;
    if ((await this.authService.validateUser(user.email, password)) === null) {
      // update auth
      await this.authService.update({
        user,
        password,
      });
      // update user
      delete user.auth;
      await this.userRepository.update(user, userDto);
    }
    return await this.userRepository.findOne(user.id);
  }
}

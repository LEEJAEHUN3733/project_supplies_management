import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 회원 등록
  async create(CreateUserDTO: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(CreateUserDTO);
    return this.userRepository.save(user);
  }

  // 모든 회원 조회
  async findUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // id를 기반으로 유저 조회
  async findUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  // 유저 정보 갱신
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUser(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  // 유저 정보 삭제
  async delete(id: number): Promise<void> {
    const user = await this.findUser(id);
    // remove 대신 softRemove를 사용하여 소프트 삭제 수행.
    await this.userRepository.softRemove(user);
  }
}

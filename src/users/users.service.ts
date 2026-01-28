import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult } from 'typeorm/browser';

export type Users = User;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  find(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  update(id: string, userData: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update(id, userData);
  }

  // Menghapus user
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

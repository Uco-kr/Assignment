import { Injectable } from '@nestjs/common';
import { Repository } from './repository';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UsersService {
  constructor(private repo: Repository) {}

  async findOne(name: string): Promise<User> {
    const user = await this.repo.findOne(name);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.repo.findOneByEmail(email);
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const bcryptData = {
      ...data,
      password: hashedPassword,
    };
    return await this.repo.create(bcryptData);
  }

  async updateUser(uuid: string, data: UpdateUserDto): Promise<User> {
    if (data.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      const bcryptData = {
        ...data,
        password: hashedPassword,
      };
      return await this.repo.updateUser(uuid, bcryptData);
    }
    return await this.repo.updateUser(uuid, data);
  }

  async subscribe(uuid: string, category_id: string): Promise<User> {
    return await this.repo.subscribe(uuid, category_id);
  }
}

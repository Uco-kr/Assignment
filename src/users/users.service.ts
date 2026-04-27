import { Injectable } from '@nestjs/common';
import { Repository } from './repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repo: Repository) {}

  async findOne(name: string): Promise<User> {
    const user = await this.repo.findOne(name);
    return user;
  }
}

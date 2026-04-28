import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UpdateUserDto } from '../dto/UpdateUserDto';

@Injectable()
export class Repository {
  constructor(private prisma: PrismaService) {}

  async findOne(name: string): Promise<User> {
    const findUSer = await this.prisma.user.findUnique({
      where: { name: name },
    });
    if (!findUSer) {
      throw new NotFoundException(`이름이 ${name}인 사용자가 없습니다.`);
    }
    return findUSer;
  }

  async create(create: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: create });
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id: id }, data: data });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: id } });
  }
}

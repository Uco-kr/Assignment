import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

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

  async findOneByEmail(email: string): Promise<User> {
    const findUser = await this.prisma.user.findFirst({
      where: { email: email },
    });
    if (!findUser) {
      throw new NotFoundException(`email이 ${email}인 사용자가 없습니다.`);
    }
    return findUser;
  }

  async create(create: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: create });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({ where: { uuid: id }, data: data });
  }

  async subscribe(uuid: string, category_id: string): Promise<User> {
    const subscriber = await this.prisma.userCategory.create({
      data: { userId: uuid, categoryId: category_id },
      include: { user: true },
    });

    return subscriber.user;
  }
}

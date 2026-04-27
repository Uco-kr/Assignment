import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
}

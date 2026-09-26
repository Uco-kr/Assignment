import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findUserByUuid(userUuid: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { uuid: userUuid },
    });
    if (!user) {
      throw new NotFoundException('사용자가 조회되지 않았습니다.');
    }
    return user;
  }

  async getMe(userUuid: string): Promise<User> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { uuid: userUuid },
    });
    return user;
  }

  async findUserOrCreate(userInfo: {
    uuid: string;
    name: string;
    email: string;
  }): Promise<User> {
    return await this.prismaService.user.upsert({
      where: { uuid: userInfo.uuid },
      create: {
        uuid: userInfo.uuid,
        name: userInfo.name,
        email: userInfo.email,
      },
      update: { name: userInfo.name, email: userInfo.email },
    });
  }
}

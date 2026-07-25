import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class authRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserOrCreate(userInfo: {
    uuid: string;
    name: string;
    email: string;
  }): Promise<User> {
    return await this.prismaService.user
      .upsert({
        where: { uuid: userInfo.uuid },
        create: {
          uuid: userInfo.uuid,
          name: userInfo.name,
          email: userInfo.email,
        },
        update: { name: userInfo.name, email: userInfo.email },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('unknown error');
      });
  }

  async del(refreshToken: string): Promise<void> {
    await this.prismaService.refreshToken.delete({
      where: { token: refreshToken },
    });
  }

  async saveRefreshToken(refreshToken: string, uuid: string): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: { userId: uuid },
    });

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: uuid,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}

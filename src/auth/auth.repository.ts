import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshToken(
    token: string,
    userId: string,
    refreshExpiresIn: number,
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + refreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
  }

  async deleteRefreshToken(token: string | undefined): Promise<void> {
    if (!token) {
      return;
    }

    await this.prisma.refreshToken.deleteMany({
      where: {
        token,
      },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/CreatePostDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class Repository {
  constructor(private prisma: PrismaService) {}

  async create(create: CreatePostDto): Promise<Post> {
    return await this.prisma.post.create({ data: create });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

  async findByPostID(id: number): Promise<Post> {
    const Post = await this.prisma.post.findUnique({ where: { id: id } });
    if (!Post) {
      throw new NotFoundException(`id가 ${id}인 게시물이 없습니다.`);
    }
    return Post;
  }

  async findByAuthID(id: number): Promise<Post[]> {
    const Post = await this.prisma.post.findMany({ where: { authorId: id } });
    if (!Post.length) {
      throw new NotFoundException(
        `id가 ${id}인 USER가 작성한 게시물이 없습니다.`,
      );
    }
    return Post;
  }

  async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    return this.prisma.post.update({ where: { id: id }, data: data });
  }

  async deletePost(id: number): Promise<void> {
    await this.prisma.post.delete({ where: { id: id } });
  }
}

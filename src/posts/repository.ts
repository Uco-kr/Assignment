import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class Repository {
  constructor(private prisma: PrismaService) {}

  async create(create: CreatePostDto & { authorId: string }): Promise<Post> {
    return await this.prisma.post.create({ data: create });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

  async findByPostID(id: string): Promise<Post> {
    const Post = await this.prisma.post.findUnique({ where: { uuid: id } });
    if (!Post) {
      throw new NotFoundException(`id가 ${id}인 게시물이 없습니다.`);
    }
    return Post;
  }

  async findByAuthorID(id: string): Promise<Post[]> {
    const Post = await this.prisma.post.findMany({ where: { authorId: id } });
    if (!Post.length) {
      throw new NotFoundException(
        `id가 ${id}인 USER가 작성한 게시물이 없습니다.`,
      );
    }
    return Post;
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    return this.prisma.post.update({ where: { uuid: id }, data: data });
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { uuid: id } });
  }

  async categorize(id: string, category_id: string): Promise<Post> {
    const categorizer = await this.prisma.postCategory.create({
      data: { postId: id, categoryId: category_id },
      include: { post: true },
    });
    return categorizer.post;
  }
}

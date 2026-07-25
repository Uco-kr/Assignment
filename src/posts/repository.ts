import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PrismaService } from '../prisma/prisma.service';
import { Posts } from '@prisma/client';

@Injectable()
export class Repository {
  constructor(private prisma: PrismaService) {}

  async create(create: CreatePostDto & { authorId: string }): Promise<Posts> {
    return await this.prisma.posts.create({ data: create });
  }

  async findAll(): Promise<Posts[]> {
    return await this.prisma.posts.findMany();
  }

  async findByPostID(id: string): Promise<Posts> {
    const Post = await this.prisma.posts.findUnique({ where: { uuid: id } });
    if (!Post) {
      throw new NotFoundException(`id가 ${id}인 게시물이 없습니다.`);
    }
    return Post;
  }

  async findByAuthorID(id: string): Promise<Posts[]> {
    const Post = await this.prisma.posts.findMany({ where: { authorId: id } });
    if (!Post.length) {
      throw new NotFoundException(
        `id가 ${id}인 USER가 작성한 게시물이 없습니다.`,
      );
    }
    return Post;
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Posts> {
    return this.prisma.posts.update({ where: { uuid: id }, data: data });
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.posts.delete({ where: { uuid: id } });
  }

  async categorize(PostId: string, category_id: string): Promise<Posts> {
    const categorizer = await this.prisma.postCategory.create({
      data: { postId: PostId, categoryId: category_id },
      include: { post: true },
    });
    return categorizer.post;
  }
}

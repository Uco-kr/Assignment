import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PrismaService } from '../prisma/prisma.service';
import { Posts } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    create: Omit<CreatePostDto, 'category_id'> & { authorId: string },
  ): Promise<Posts> {
    return await this.prisma.posts.create({ data: create });
  }

  async findAll(): Promise<Posts[]> {
    return await this.prisma.posts.findMany();
  }

  async findByPostID(id: string): Promise<Posts | null> {
    const Post = await this.prisma.posts.findUnique({
      where: { uuid: id },
      include: { PostCategory: { select: { categoryId: true } } },
    });
    return Post;
  }

  async findByAuthorID(id: string): Promise<Posts[]> {
    const Post = await this.prisma.posts.findMany({
      where: { authorId: id },
      include: { PostCategory: { select: { category: true } } },
    });
    return Post;
  }

  async updatePost(
    id: string,
    data: Omit<UpdatePostDto, 'category_id'>,
  ): Promise<Posts> {
    return this.prisma.posts.update({ where: { uuid: id }, data: data });
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.posts.delete({ where: { uuid: id } });
  }

  async categorize(PostId: string, categoryIds: string[]): Promise<Posts> {
    await this.prisma.$transaction([
      this.prisma.postCategory.deleteMany({
        where: { postId: PostId },
      }),
      this.prisma.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId: PostId,
          categoryId: categoryId,
        })),
      }),
    ]);
    return await this.prisma.posts.findUniqueOrThrow({
      where: { uuid: PostId },
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }

  async getOwnPost(id: string, skip: number, take: number) {
    return await this.prisma.posts.findMany({
      where: { authorId: id },
      take: take,
      skip: skip,
    });
  }
}

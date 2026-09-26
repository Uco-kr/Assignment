import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Posts } from '@prisma/client';

export type PostWithCategories = Prisma.PostsGetPayload<{
  include: { PostCategory: { select: { categoryId: true } } };
}>;

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    {
      title,
      content,
      authorId,
    }: {
      title: string;
      content: string;
      authorId: string;
    },
    categoryIds: string[],
  ): Promise<PostWithCategories> {
    return this.prisma.posts.create({
      data: {
        title,
        content,
        authorId,
        PostCategory: {
          create: categoryIds.map((categoryId) => ({
            category: { connect: { uuid: categoryId } },
          })),
        },
      },
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }

  async findAll(): Promise<Posts[]> {
    return await this.prisma.posts.findMany();
  }

  async findPostById(postUuid: string): Promise<PostWithCategories | null> {
    return this.prisma.posts.findUnique({
      where: { uuid: postUuid },
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }

  async findPostsByAuthorId(userUuid: string): Promise<PostWithCategories[]> {
    return this.prisma.posts.findMany({
      where: { authorId: userUuid },
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }

  async updatePost(
    postUuid: string,
    data: { title?: string; content?: string },
    categoryIds?: string[],
  ): Promise<PostWithCategories> {
    return this.prisma.posts.update({
      where: { uuid: postUuid },
      data: {
        ...data,
        ...(categoryIds !== undefined && {
          PostCategory: {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({
              category: { connect: { uuid: categoryId } },
            })),
          },
        }),
      },
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }

  async deletePost(postUuid: string): Promise<void> {
    await this.prisma.posts.delete({ where: { uuid: postUuid } });
  }

  async categorize(
    postId: string,
    categoryIds: string[],
  ): Promise<PostWithCategories> {
    return this.prisma.posts.update({
      where: { uuid: postId },
      data: {
        PostCategory: {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            category: { connect: { uuid: categoryId } },
          })),
        },
      },
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }

  async getOwnPosts(
    userUuid: string,
    skip: number,
    take: number,
  ): Promise<PostWithCategories[]> {
    return this.prisma.posts.findMany({
      where: { authorId: userUuid },
      take,
      skip,
      include: { PostCategory: { select: { categoryId: true } } },
    });
  }
}

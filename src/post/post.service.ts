import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Posts } from '@prisma/client';
import { PostRepository } from './post.repository';
import { AlarmService } from '../alarm/alarm.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly alarmService: AlarmService,
    private readonly categoryService: CategoryService,
  ) {}

  async create({
    authorId,
    title,
    content,
    categoryIds,
  }: {
    authorId: string;
    title: string;
    content: string;
    categoryIds?: string[];
  }): Promise<Posts> {
    const uniqueCategoryIds = [...new Set(categoryIds)];
    await this.validateCategories(uniqueCategoryIds);
    const post = await this.postRepository.create(
      { authorId, title, content },
      uniqueCategoryIds,
    );
    await this.pushAlarm(uniqueCategoryIds);
    return post;
  }

  async findPostById(postId: string): Promise<Posts> {
    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundException(`해당 ID를 가진 게시글이 없습니다.`);
    }
    return post;
  }

  async findPostsByAuthorId(authorId: string): Promise<Posts[]> {
    return this.postRepository.findPostsByAuthorId(authorId);
  }

  async updatePost({
    postId,
    userId,
    title,
    content,
    categoryIds,
  }: {
    postId: string;
    userId: string;
    title?: string;
    content?: string;
    categoryIds?: string[];
  }): Promise<Posts> {
    const post = await this.findPostById(postId);

    if (!this.validateEdit(post.authorId, userId)) {
      throw new ForbiddenException(`수정권한이 없습니다.`);
    }

    const uniqueCategoryIds =
      categoryIds === undefined ? undefined : [...new Set(categoryIds)];

    if (uniqueCategoryIds !== undefined) {
      await this.validateCategories(uniqueCategoryIds);
    }

    const updatedPost = await this.postRepository.updatePost(
      postId,
      { title, content },
      uniqueCategoryIds,
    );

    if (uniqueCategoryIds?.length) {
      await this.pushAlarm(uniqueCategoryIds);
    }

    return updatedPost;
  }

  async validateCategories(categoryIds: string[]): Promise<void> {
    if (categoryIds.length === 0) {
      return;
    }
    const existingCategoryIds =
      await this.categoryService.findExistingCategoryIds(categoryIds);
    if (existingCategoryIds.length !== categoryIds.length) {
      throw new BadRequestException('존재하지 않은 카테고리가 있습니다.');
    }
  }

  async deletePost(
    postId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const post = await this.findPostById(postId);
    this.validateEdit(post?.authorId, userId);
    await this.postRepository.deletePost(postId);
    return { message: `Id가 ${postId}인 게시글을 삭제하였습니다.` };
  }

  validateEdit(authorId: string, userId: string): boolean {
    if (authorId !== userId) {
      return false;
    }
    return true;
  }

  async categorize(
    postId: string,
    categoryIds: string[],
    userId: string,
  ): Promise<Posts> {
    const post = await this.findPostById(postId);
    if (!this.validateEdit(post.authorId, userId)) {
      throw new ForbiddenException(`수정권한이 없습니다.`);
    }
    const uniqueCategoryIds = [...new Set(categoryIds)];
    await this.validateCategories(uniqueCategoryIds);
    const updatedPost = await this.postRepository.categorize(
      postId,
      uniqueCategoryIds,
    );
    await this.pushAlarm(uniqueCategoryIds);
    return updatedPost;
  }

  async pushAlarm(categoryIds: string[]): Promise<void> {
    const userIds =
      await this.categoryService.findSubscriberIdsByCategoryIds(categoryIds);
    await this.alarmService.push(userIds);
  }

  async getOwnPosts({
    userUuid,
    skip,
    take,
  }: {
    userUuid: string;
    skip: number;
    take: number;
  }): Promise<Posts[]> {
    return this.postRepository.getOwnPosts(userUuid, skip, take);
  }
}

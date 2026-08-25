import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { Posts } from '@prisma/client';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PostRepository } from './posts.repository';
import { AlarmService } from '../alarm/alarm.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly repo: PostRepository,
    private readonly alarmService: AlarmService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(authorId: string, dto: CreatePostDto): Promise<Posts> {
    const { categoryIds, ...data } = dto;
    const createData = { ...data, authorId: authorId };
    if (categoryIds) {
      await this.validateCategory(categoryIds);
      const post = await this.repo.create(createData);
      await this.categorize(post.uuid, categoryIds, authorId);
      await this.pushAlarm(categoryIds);
      return post;
    }

    return await this.repo.create(createData);
  }

  async findByPostID(id: string): Promise<Posts> {
    const postIDpost = await this.repo.findByPostID(id);
    if (!postIDpost) {
      throw new NotFoundException(`해당 ID를 가진 게시글이 없습니다.`);
    }
    return postIDpost;
  }

  async findByAuthorID(id: string): Promise<Posts[]> {
    const userIDpost = this.repo.findByAuthorID(id);
    return userIDpost;
  }

  async updatePost(
    id: string,
    userId: string,
    dto: UpdatePostDto,
  ): Promise<Posts> {
    const Post = await this.findByPostID(id);
    if (Post.authorId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    const { categoryIds, ...data } = dto;
    if (categoryIds) {
      await this.validateCategory(categoryIds);
      await this.categorize(id, categoryIds, userId);
      await this.pushAlarm(categoryIds);
    }
    return await this.repo.updatePost(id, data);
  }

  async validateCategory(categoryIds: string[]): Promise<void> {
    const existedCategory = await this.categoryService.getCategoryId();

    // DB에 존재하지 않는 카테고리 ID만 필터링 (includes 활용)
    const invalidCategories = categoryIds.filter(
      (category) => !existedCategory.includes(category),
    );

    if (invalidCategories.length > 0) {
      throw new BadRequestException(
        `${invalidCategories.join(', ')}는 존재하지 않는 카테고리입니다.`,
      );
    }
  }

  async deletePost(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.findByPostID(id);
    this.validateEdit(post?.authorId, userId);
    await this.repo.deletePost(id);
    return { message: `Id가 ${id}인 게시글을 삭제하였습니다.` };
  }

  validateEdit(authorId: string, userId: string): void {
    if (authorId !== userId) {
      throw new ForbiddenException(`수정권한이 없습니다.`);
    }
  }

  async categorize(
    PostId: string,
    categoryIds: string[],
    userId: string,
  ): Promise<Posts> {
    const post = await this.findByPostID(PostId);
    await this.validateCategory(categoryIds);
    if (post?.authorId !== userId) {
      throw new ForbiddenException('수정권한이 없습니다.');
    }
    return await this.repo.categorize(PostId, categoryIds);
  }

  async pushAlarm(categoryId: string[]) {
    const [users] = await Promise.all(
      categoryId.map(
        async (category: string) =>
          await this.categoryService.FindSubscribeUser(category),
      ),
    );
    const deviceId = Array.from(new Set(users));
    await this.alarmService.push(deviceId);
  }

  async getOwnPost(id: string, skip: number, take: number): Promise<Posts[]> {
    return await this.repo.getOwnPost(id, skip, take);
  }
}

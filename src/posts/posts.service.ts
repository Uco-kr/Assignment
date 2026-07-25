import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { Posts } from '@prisma/client';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { Repository } from './repository';

@Injectable()
export class PostsService {
  constructor(private readonly repo: Repository) {}

  async create(authorId: string, data: CreatePostDto): Promise<Posts> {
    const createDate = { ...data, authorId: authorId };
    return await this.repo.create(createDate);
  }

  async findAll(): Promise<Posts[]> {
    return await this.repo.findAll();
  }

  async findByPostID(id: string): Promise<Posts> {
    const postIDpost = await this.repo.findByPostID(id);
    return postIDpost;
  }

  async findByAuthorID(id: string): Promise<Posts[]> {
    const userIDpost = this.repo.findByAuthorID(id);
    return userIDpost;
  }

  async updatePost(
    id: string,
    userId: string,
    data: UpdatePostDto,
  ): Promise<Posts> {
    const Post = await this.repo.findByPostID(id);
    if (Post.authorId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    return await this.repo.updatePost(id, data);
  }

  async deletePost(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.repo.findByPostID(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    await this.repo.deletePost(id);
    return { message: `Id가 ${id}인 게시글을 삭제하였습니다.` };
  }

  async categorize(
    PostId: string,
    category_id: string,
    userId: string,
  ): Promise<Posts> {
    const post = await this.repo.findByPostID(PostId);
    if (post.authorId !== userId) {
      throw new ForbiddenException('수정권한이 없습니다.');
    }
    return await this.repo.categorize(PostId, category_id);
  }
}

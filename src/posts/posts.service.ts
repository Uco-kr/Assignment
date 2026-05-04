import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { Repository } from './repository';

@Injectable()
export class PostsService {
  constructor(private readonly repo: Repository) {}

  async create(authorId: number, data: CreatePostDto): Promise<Post> {
    const createDate = { ...data, authorId: authorId };
    return await this.repo.create(createDate);
  }

  async findAll(): Promise<Post[]> {
    return await this.repo.findAll();
  }

  async findByPostID(id: number): Promise<Post> {
    const postIDpost = await this.repo.findByPostID(id);
    return postIDpost;
  }

  async findByAuthorID(id: number): Promise<Post[]> {
    const userIDpost = this.repo.findByAuthorID(id);
    return userIDpost;
  }

  async updatePost(
    id: number,
    userId: number,
    data: UpdatePostDto,
  ): Promise<Post> {
    const Post = await this.repo.findByPostID(id);
    if (Post.authorId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    return await this.repo.updatePost(id, data);
  }

  async deletePost(id: number, userId: number): Promise<{ message: string }> {
    const post = await this.repo.findByPostID(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    await this.repo.deletePost(id);
    return { message: `Id가 ${id}인 게시글을 삭제하였습니다.` };
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/CreatePostDto';
import { Post } from '@prisma/client';
import { UpdatePostDto } from '../dto/UpdatePostDto';
import { Repository } from './repository';

@Injectable()
export class PostsService {
  constructor(private readonly repo: Repository) {}

  async create(data: CreatePostDto): Promise<Post> {
    return await this.repo.create(data);
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

  async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.repo.updatePost(id, data);
    return updatedPost;
  }

  async deletePost(id: number): Promise<{ message: string }> {
    await this.repo.deletePost(id);
    return { message: `Id가 ${id}인 게시글을 삭제하였습니다.` };
  }
}

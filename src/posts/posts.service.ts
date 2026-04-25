import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/CreatePostDto';
import { post } from './interface';
import { UpdatePostDto } from '../dto/UpdatePostDto';

@Injectable()
export class PostsService {
  private posts: post[] = [];
  private length = 0;

  create(data: CreatePostDto): post {
    const newPost = {
      createdAT: new Date().toISOString(),
      updateAT: new Date().toISOString(),
      ...data,
      id: this.length === 0 ? 0 : this.length + 1,
    };
    this.posts.push(newPost);
    this.length++;
    return newPost;
  }

  findAll() {
    return this.posts;
  }

  findByPostID(id: number): post {
    const postIDpost = this.posts.find((posts) => posts.id == id);
    if (!postIDpost) {
      throw new NotFoundException();
    }
    return postIDpost;
  }

  findByAuthID(id: number): post[] {
    const userIDpost = this.posts.filter((posts) => posts.authID == id);
    if (!userIDpost.length) {
      throw new NotFoundException();
    }
    return userIDpost;
  }

  updatePost(id: number, data: UpdatePostDto): post {
    const findPost = this.findByPostID(id);
    Object.assign(findPost, data);
    findPost.updateAT = new Date().toISOString();
    return findPost;
  }

  deletePost(id: number) {
    this.posts = this.posts.filter((posts) => posts.id != id);
    return { message: `Id가 ${id}인 게시글을 삭제하였습니다.` };
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/CreatePostDto';
import { UpdatePostDto } from '../dto/UpdatePostDto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postservice: PostsService) {}

  @Post()
  create(@Body() created: CreatePostDto) {
    return this.postservice.create(created);
  }

  @Get()
  findAll() {
    return this.postservice.findAll();
  }

  @Get('author/:id')
  findByAuthID(@Param('id', ParseIntPipe) id: number) {
    return this.postservice.findByAuthID(id);
  }

  @Get(':id')
  findByPostID(@Param('id', ParseIntPipe) id: number) {
    return this.postservice.findByPostID(id);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() update: UpdatePostDto,
  ) {
    return this.postservice.updatePost(id, update);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postservice.deletePost(id);
  }
}

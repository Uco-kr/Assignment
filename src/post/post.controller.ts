import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/req/create-post.dto';
import { UpdatePostDto } from './dto/req/update-post.dto';
import { GetOwnPostDto } from './dto/req/get-own-post.dto';
import { SetPostCategoriesDto } from './dto/req/set-post-categories.dto';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { User } from '@prisma/client';
import { PostIdDto } from './dto/req/post-id.dot';
import { GetUser } from '../category/get-user.decorator';

@ApiTags('post')
@Controller('post')
export class PostsController {
  constructor(private readonly postservice: PostsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({
    type: CreatePostDto,
    required: true,
  })
  async create(@GetUser() user: User, @Body() createPostDto: CreatePostDto) {
    return await this.postservice.create({
      authorId: user.uuid,
      title: createPostDto.title,
      content: createPostDto.content,
      categoryIds: createPostDto.categoryIds,
    });
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'skip & take Post', type: GetOwnPostDto, required: true })
  async getOwnPosts(
    @GetUser() user: User,
    @Query() { skip, take }: GetOwnPostDto,
  ) {
    return await this.postservice.getOwnPosts({
      userUuid: user.uuid,
      skip,
      take,
    });
  }

  @Get('author/:authorUuid')
  @ApiParam({ name: 'authorUuid', type: String, required: false })
  findPostsByAuthorId(@Param('authorUuid') authorUuid: string) {
    return this.postservice.findPostsByAuthorId(authorUuid);
  }

  @Get(':postId')
  @ApiParam({ name: 'postId', type: String, required: true })
  async findPostById(@Param('postId') PostIdDto: PostIdDto) {
    return await this.postservice.findPostById(PostIdDto.postId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  @ApiParam({ name: 'postId', type: String, required: true })
  @ApiBody({ type: UpdatePostDto, required: true })
  async updatePost(
    @Param('postId') PostIdDto: PostIdDto,
    @GetUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postservice.updatePost({
      postId: PostIdDto.postId,
      userId: user.uuid,
      title: updatePostDto.title,
      content: updatePostDto.content,
      categoryIds: updatePostDto.categoryIds,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  @ApiParam({ name: 'postId', type: String, required: true })
  async deletePost(
    @Param('postId') PostIdDto: PostIdDto,
    @GetUser() user: User,
  ) {
    return await this.postservice.deletePost(PostIdDto.postId, user.uuid);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':postId/categories')
  @ApiParam({ name: 'postId', type: String, required: true })
  @ApiBody({ type: SetPostCategoriesDto, required: true })
  async categorize(
    @GetUser() user: User,
    @Param('postId') PostIdDto: PostIdDto,
    @Body() { categoryIds }: SetPostCategoriesDto,
  ) {
    return await this.postservice.categorize(
      PostIdDto.postId,
      categoryIds,
      user.uuid,
    );
  }
}

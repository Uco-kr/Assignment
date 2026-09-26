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
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/req/createPostDto';
import { UpdatePostDto } from './dto/req/updatePostDto';
import { GetOwnPostDto } from './dto/req/getOwnPostDto';
import { SetPostCategoriesDto } from './dto/req/setPostCategoriesDto';
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
  create(
    @Req() req: Request & { user: { uuid: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postservice.create({
      authorId: req.user.uuid,
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
    @Req() req: Request & { user: User },
    @Query() { skip, take }: GetOwnPostDto,
  ) {
    return this.postservice.getOwnPosts({
      userUuid: req.user.uuid,
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
  findPostById(@Param('postId') postId: string) {
    return this.postservice.findPostById(postId);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  @ApiParam({ name: 'postId', type: String, required: true })
  @ApiBody({ type: UpdatePostDto, required: true })
  updatePost(
    @Param('postId') postId: string,
    @Req() req: Request & { user: User },
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postservice.updatePost({
      postId,
      userId: req.user.uuid,
      title: updatePostDto.title,
      content: updatePostDto.content,
      categoryIds: updatePostDto.categoryIds,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  @ApiParam({ name: 'postId', type: String, required: true })
  deletePost(
    @Param('postId') postId: string,
    @Req() req: Request & { user: User },
  ) {
    return this.postservice.deletePost(postId, req.user.uuid);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':postId/categories')
  @ApiParam({ name: 'postId', type: String, required: true })
  @ApiBody({ type: SetPostCategoriesDto, required: true })
  async categorize(
    @Req() req: Request & { user: User },
    @Param('postId') postId: string,
    @Body() { categoryIds }: SetPostCategoriesDto,
  ) {
    return this.postservice.categorize(postId, categoryIds, req.user.uuid);
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
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
  @ApiCreatedResponse({
    description: '게시글이 성공적으로 생성되었습니다.',
  })
  @ApiOperation({ summary: '게시글 작성' })
  create(@Req() req: Request & { user: User }, @Body() created: CreatePostDto) {
    return this.postservice.create(req.user.uuid, created);
  }

  @Get('author/:id')
  @ApiOperation({ summary: '유저 ID기반 게시글 가져오기' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  @ApiOkResponse({ description: '게시글 찾기 성공' })
  @ApiParam({
    name: 'id',
    description: '작성자 ID',
  })
  findByAuthorID(@Param('id') id: string) {
    return this.postservice.findByAuthorID(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 ID기반 게시글 가져오기' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  @ApiOkResponse({ description: '게시글 찾기 성공' })
  @ApiParam({
    name: 'id',
    description: '게시글 ID',
  })
  findByPostID(@Param('id') id: string) {
    return this.postservice.findByPostID(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: '게시글 업데이트' })
  @ApiOkResponse({
    description: '성공',
  })
  @ApiNotFoundResponse({
    description: '게시글을 찾을 수 없습니다.',
  })
  @ApiParam({
    name: 'id',
    description: '게시글 ID',
  })
  updatePost(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
    @Body() update: UpdatePostDto,
  ) {
    return this.postservice.updatePost(id, req.user.uuid, update);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  @ApiOkResponse({ description: '게시글 제거 성공' })
  @ApiParam({
    name: 'id',
    description: '게시글 ID',
  })
  deletePost(@Param('id') id: string, @Req() req: Request & { user: User }) {
    return this.postservice.deletePost(id, req.user.uuid);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시글 카테고리 지정',
    description:
      '게시글 ID와 카테고리 ID를 받아 게시글의 카테고리를 설정합니다.',
  })
  @ApiCreatedResponse({
    description: '카테고리 지정 완료된 게시글 반환',
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 요청' })
  @ApiNotFoundResponse({ description: '게시글 또는 카테고리를 찾을 수 없음' })
  @Post('categorize/:id/:category_id') // post/:postId/category/:categroyId
  async categorize(
    @Req() req: Request & { user: User },
    @Param('id') PostId: string, // 게시글 ID
    @Param('category_id') category_id: string[], // 카테고리 ID
  ) {
    return await this.postservice.categorize(
      PostId,
      category_id,
      req.user.uuid,
    );
  }

  @Get('getOwnPost')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getOwnPost(
    @Req() req: Request & { user: User },
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.postservice.getOwnPost(req.user.uuid, skip, take);
  }
}

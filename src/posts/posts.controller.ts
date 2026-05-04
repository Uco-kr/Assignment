import {
  Body,
  Controller,
  Post,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('post')
@Controller('post')
export class PostsController {
  constructor(private readonly postservice: PostsService) {}

  @Post(':authorId')
  @ApiCreatedResponse({
    description: '게시글이 성공적으로 생성되었습니다.',
  })
  @ApiOperation({ summary: '게시글 작성' })
  create(
    @Param('authorId', ParseIntPipe) id: number,
    @Body() created: CreatePostDto,
  ) {
    return this.postservice.create(id, created);
  }

  @Get()
  @ApiOperation({ summary: '모든 게시글 가져오기' })
  @ApiOkResponse({ description: '게시글 찾기 성공' })
  findAll() {
    return this.postservice.findAll();
  }

  @Get('author/:id')
  @ApiOperation({ summary: '유저 ID기반 게시글 가져오기' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  @ApiOkResponse({ description: '게시글 찾기 성공' })
  @ApiParam({
    name: 'id',
    description: '작성자 ID',
  })
  findByAuthorID(@Param('id', ParseIntPipe) id: number) {
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
  findByPostID(@Param('id', ParseIntPipe) id: number) {
    return this.postservice.findByPostID(id);
  }

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
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Request & { user: Omit<User, 'password'> },
    @Body() update: UpdatePostDto,
  ) {
    return this.postservice.updatePost(id, req.user.id, update);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  @ApiOkResponse({ description: '게시글 제거 성공' })
  @ApiParam({
    name: 'id',
    description: '게시글 ID',
  })
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Request & { user: Omit<User, 'password'> },
  ) {
    return this.postservice.deletePost(id, req.user.id);
  }
}

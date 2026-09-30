import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { User } from '@prisma/client';
import { GetUser } from './get-user.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body('categoryName') categoryName: string) {
    return await this.categoryService.createCategory(categoryName);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCategory(@Body('categoryId') categoryId: string) {
    return await this.categoryService.deleteCategory(categoryId);
  }

  @Get()
  async getCategoryIds() {
    return await this.categoryService.getCategoryIds();
  }

  @Get('post-count')
  async getPostCounts() {
    return await this.categoryService.getPostCounts();
  }

  @Get('user-count')
  async getUserCounts() {
    return await this.categoryService.getUserCounts();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('user-subscribe')
  async getSubscribedCategories(@GetUser() user: User) {
    return await this.categoryService.getSubscribedCategories(user.uuid);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(
    @GetUser() user: User,
    @Body('categoryId') categoryId: string,
  ): Promise<User> {
    return await this.categoryService.subscribe(user.uuid, categoryId);
  }
}

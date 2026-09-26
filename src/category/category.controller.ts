import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { User } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() categoryName: string) {
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
  async getSubscribedCategories(
    @Req() req: Request & { user: { uuid: string } },
  ) {
    return await this.categoryService.getSubscribedCategories(req.user.uuid);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':categoryId/subscribe')
  async subscribe(
    @Req() req: Request & { user: { uuid: string } },
    @Param('categoryId') categoryId: string,
  ): Promise<User> {
    return await this.categoryService.subscribe(req.user.uuid, categoryId);
  }
}

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
import { createCategoryDto } from './dto/createCategoryDto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: createCategoryDto) {
    return await this.CategoryService.CreateCategory(createCategoryDto.name);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.CategoryService.DeleteCategory(id);
  }

  @Get()
  async getCategory() {
    return await this.CategoryService.getCategoryId();
  }

  @Get('PostCount')
  async getPostCount() {
    return await this.CategoryService.getPostCount();
  }

  @Get('UserCount')
  async getUserCount() {
    return await this.CategoryService.getUserCount();
  }

  @ApiOperation({
    description: '',
  })
  @Get('UserSubscribe')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getCategorySubscribing(
    @Req() req: Request & { user: { uuid: string } },
  ) {
    return await this.CategoryService.getCategorySubscribing(req.user.uuid);
  }
}

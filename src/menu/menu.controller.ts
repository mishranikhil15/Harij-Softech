import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  // Categories
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard)
  async findAllCategories() {
    return this.menuService.findAllCategories();
  }

  @Get('categories/:id')
  @UseGuards(JwtAuthGuard)
  async findCategoryById(@Param('id') id: string) {
    return this.menuService.findCategoryById(parseInt(id));
  }

  // Menu Items
  @Post('items')
  @UseGuards(JwtAuthGuard)
  async createMenuItem(@Body() dto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(dto);
  }

  @Get('items')
  @UseGuards(JwtAuthGuard)
  async findAllItems(@Query('available') available?: string) {
    if (available === 'true') {
      return this.menuService.findAvailableItems();
    }
    return this.menuService.findAllItems();
  }

  @Get('category/:categoryId/items')
  @UseGuards(JwtAuthGuard)
  async findItemsByCategory(@Param('categoryId') categoryId: string) {
    return this.menuService.findItemsByCategory(parseInt(categoryId));
  }

  @Get('items/:id')
  @UseGuards(JwtAuthGuard)
  async findItemById(@Param('id') id: string) {
    return this.menuService.findItemById(parseInt(id));
  }

  @Patch('items/:id/availability')
  @UseGuards(JwtAuthGuard)
  async updateItemAvailability(
    @Param('id') id: string,
    @Body() body: { available: boolean },
  ) {
    return this.menuService.updateItemAvailability(parseInt(id), body.available);
  }
}

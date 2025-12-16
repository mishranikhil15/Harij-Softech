import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemEntity } from './menu-item.entity';
import { MenuCategoryEntity } from './menu-category.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItemEntity)
    private itemRepo: Repository<MenuItemEntity>,
    @InjectRepository(MenuCategoryEntity)
    private categoryRepo: Repository<MenuCategoryEntity>,
  ) {}

  // Categories
  async createCategory(dto: CreateCategoryDto) {
    return this.categoryRepo.save(dto);
  }

  async findAllCategories() {
    return this.categoryRepo.find();
  }

  async findCategoryById(id: number) {
    return this.categoryRepo.findOne({ where: { id } });
  }

  // Menu Items
  async createMenuItem(dto: CreateMenuItemDto) {
    return this.itemRepo.save(dto);
  }

  async findAllItems() {
    return this.itemRepo.find();
  }

  async findAvailableItems() {
    return this.itemRepo.find({ where: { available: true } });
  }

  async findItemsByCategory(categoryId: number) {
    return this.itemRepo.find({ where: { categoryId } });
  }

  async findItemById(id: number) {
    return this.itemRepo.findOne({ where: { id } });
  }

  async updateItemAvailability(id: number, available: boolean) {
    const item = await this.findItemById(id);
    if (!item) throw new NotFoundException('Menu item not found');

    item.available = available;
    return this.itemRepo.save(item);
  }
}

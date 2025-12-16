import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('floors')
export class FloorsController {
  constructor(private floorsService: FloorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateFloorDto) {
    return this.floorsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.floorsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.floorsService.findById(parseInt(id));
  }
}

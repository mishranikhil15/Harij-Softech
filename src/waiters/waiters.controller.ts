import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WaitersService } from './waiters.service';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('waiters')
export class WaitersController {
  constructor(private waitersService: WaitersService) {}

  @Post()
  async create(@Body() dto: CreateWaiterDto) {
    return this.waitersService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.waitersService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  async findActiveWaiters() {
    return this.waitersService.findActiveWaiters();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.waitersService.findById(parseInt(id));
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.waitersService.updateStatus(parseInt(id), body.isActive);
  }
}

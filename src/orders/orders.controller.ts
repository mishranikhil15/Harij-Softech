import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateOrderDto, @Request() req: any) {
    if (!req.user || !req.user.sub) {
      throw new BadRequestException('Invalid token');
    }
    return this.ordersService.create(dto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('table/:tableId')
  @UseGuards(JwtAuthGuard)
  async findByTable(@Param('tableId') tableId: string) {
    return this.ordersService.findByTable(parseInt(tableId));
  }

  @Get('waiter/:waiterId')
  @UseGuards(JwtAuthGuard)
  async findByWaiter(@Param('waiterId') waiterId: string) {
    return this.ordersService.findByWaiter(parseInt(waiterId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}

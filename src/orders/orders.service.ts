import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from './order.repository';
import { Order } from './domain/order';
import { OrderEntity } from './infrastructure/persistence/relational/entities/order.entity';
import { OrderItemEntity } from './infrastructure/persistence/relational/entities/order-item.entity';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { MenuService } from '../menu/menu.service';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @InjectRepository(OrderEntity)
    private orderEntityRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepo: Repository<OrderItemEntity>,
    private menuService: MenuService,
    private tablesService: TablesService,
  ) {}

  async create(dto: CreateOrderDto, waiterId: number) {
    // Validate table exists and is assigned to waiter
    const table = await this.tablesService.findById(dto.tableId);
    if (!table) throw new NotFoundException('Table not found');
    if (table.waiterId !== waiterId) {
      throw new BadRequestException('Table is not assigned to you');
    }

    // Validate items
    let total = 0;
    const validatedItems: Array<OrderItemDto & { price: number }> = [];

    for (const item of dto.items) {
      const menuItem = await this.menuService.findItemById(item.menuItemId);
      if (!menuItem) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      if (!menuItem.available) {
        throw new BadRequestException(`Menu item ${menuItem.name} is not available`);
      }
      if (item.quantity <= 0) throw new BadRequestException('Quantity must be positive');

      validatedItems.push({
        ...item,
        price: menuItem.price,
      });
      total += menuItem.price * item.quantity;
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order = this.orderEntityRepo.create({
      orderNumber,
      tableId: dto.tableId,
      waiterId,
      status: 'CREATED',
      total,
      notes: dto.notes,
    });

    const savedOrder = await this.orderEntityRepo.save(order);

    // Create order items
    for (const item of validatedItems) {
      const orderItem = this.orderItemRepo.create({
        orderId: savedOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        instructions: item.instructions,
        price: item.price,
      });
      await this.orderItemRepo.save(orderItem);
    }

    // Return complete order with items
    return this.findById(savedOrder.id);
  }

  async findById(id: string) {
    return this.orderEntityRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async findByTable(tableId: number) {
    return this.orderEntityRepo.find({
      where: { tableId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByWaiter(waiterId: number) {
    return this.orderEntityRepo.find({
      where: { waiterId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.orderEntityRepo.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    // Validate status transitions
    const validTransitions = {
      CREATED: ['CONFIRMED'],
      CONFIRMED: ['PREPARING'],
      PREPARING: ['SERVED'],
      SERVED: ['PAID'],
      PAID: [],
    };

    if (!validTransitions[order.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${dto.status}`,
      );
    }

    order.status = dto.status;
    return this.orderEntityRepo.save(order);
  }

  async delete(id: string) {
    const order = await this.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'CREATED') {
      throw new BadRequestException('Can only delete orders in CREATED status');
    }
    return this.orderEntityRepo.remove(order);
  }
}

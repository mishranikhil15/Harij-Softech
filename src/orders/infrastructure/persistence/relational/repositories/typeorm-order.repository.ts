import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '../../../../order.repository';
import { Order } from '../../../../domain/order';
import { OrderEntity } from '../entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';

export class TypeormOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {}

  async save(order: Order): Promise<Order> {
    const saved = await this.repo.save(OrderMapper.toEntity(order));
    return OrderMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? OrderMapper.toDomain(entity) : null;
  }
}

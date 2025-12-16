import { Order, OrderStatus } from '../../../../domain/order';
import { OrderEntity } from '../entities/order.entity';

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    return new Order(
      entity.id,
      entity.tableId,
      entity.waiterId,
      entity.status as OrderStatus,
    );
  }

  static toEntity(order: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = order.id;
    entity.tableId = order.tableId;
    entity.waiterId = order.waiterId;
    entity.status = order.getStatus();
    return entity;
  }
}

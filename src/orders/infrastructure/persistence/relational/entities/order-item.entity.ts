import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  menuItemId: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  instructions: string;

  @Column()
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne('MenuItemEntity')
  @JoinColumn({ name: 'menuItemId' })
  menuItem: any;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderEntity } from './infrastructure/persistence/relational/entities/order.entity';
import { OrderItemEntity } from './infrastructure/persistence/relational/entities/order-item.entity';
import { OrderRepository } from './order.repository';
import { TypeormOrderRepository } from './infrastructure/persistence/relational/repositories/typeorm-order.repository';
import { TablesModule } from '../tables/tables.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TablesModule,
    MenuModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: OrderRepository,
      useClass: TypeormOrderRepository,
    },
  ],
})
export class OrdersModule {}

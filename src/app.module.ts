import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { FloorsModule } from './floors/floors.module';
import { TablesModule } from './tables/tables.module';
import { MenuModule } from './menu/menu.module';
import { QrModule } from './qr/qr.module';
import { WaitersModule } from './waiters/waiters.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    WaitersModule,
    FloorsModule,
    TablesModule,
    MenuModule,
    OrdersModule,
    QrModule,
  ],
})
export class AppModule {}

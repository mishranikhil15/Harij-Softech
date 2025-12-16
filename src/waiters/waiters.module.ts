import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { WaitersService } from './waiters.service';
import { WaitersController } from './waiters.controller';
import { WaiterEntity } from './waiter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaiterEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [WaitersService],
  controllers: [WaitersController],
  exports: [WaitersService],
})
export class WaitersModule {}

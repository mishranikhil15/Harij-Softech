import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FloorsService } from './floors.service';
import { FloorsController } from './floors.controller';
import { FloorEntity } from './floor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FloorEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [FloorsService],
  controllers: [FloorsController],
  exports: [FloorsService],
})
export class FloorsModule {}

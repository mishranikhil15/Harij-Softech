import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MenuItemEntity } from './menu-item.entity';
import { MenuCategoryEntity } from './menu-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItemEntity, MenuCategoryEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService],
})
export class MenuModule {}

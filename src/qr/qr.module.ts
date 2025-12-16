import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';
import { QrTokenEntity } from './qr-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrTokenEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [QrService],
  controllers: [QrController]
})
export class QrModule {}

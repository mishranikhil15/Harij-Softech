import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { QrService } from './qr.service';
import { GenerateQrDto } from './dto/generate-qr.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('qr')
export class QrController {
  constructor(private qrService: QrService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Body() dto: GenerateQrDto) {
    return this.qrService.generate(dto.waiterId);
  }

  @Get('verify/:token')
  async verifyToken(@Param('token') token: string) {
    return this.qrService.verifyToken(token);
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrTokenEntity } from './qr-token.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class QrService {
  constructor(
    @InjectRepository(QrTokenEntity)
    private repo: Repository<QrTokenEntity>,
  ) {}

  async generate(waiterId: number) {
    const token = this.repo.create({
      token: randomUUID(),
      waiterId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    return this.repo.save(token);
  }

  async verifyToken(token: string) {
    const qrToken = await this.repo.findOne({ where: { token } });

    if (!qrToken) {
      throw new NotFoundException('Invalid QR token');
    }

    if (new Date() > qrToken.expiresAt) {
      throw new BadRequestException('QR token has expired');
    }

    return {
      valid: true,
      waiterId: qrToken.waiterId,
      expiresAt: qrToken.expiresAt,
    };
  }
}

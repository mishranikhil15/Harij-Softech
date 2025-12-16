import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaiterEntity } from './waiter.entity';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WaitersService {
  constructor(
    @InjectRepository(WaiterEntity)
    private waiterRepo: Repository<WaiterEntity>,
  ) {}

  async create(dto: CreateWaiterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.waiterRepo.save({
      username: dto.username,
      password: hashedPassword,
    });
  }

  async findById(id: number) {
    return this.waiterRepo.findOne({
      where: { id },
      select: ['id', 'username', 'isActive'],
    });
  }

  async findAll() {
    return this.waiterRepo.find({
      select: ['id', 'username', 'isActive'],
    });
  }

  async findActiveWaiters() {
    return this.waiterRepo.find({
      where: { isActive: true },
      select: ['id', 'username'],
    });
  }

  async updateStatus(id: number, isActive: boolean) {
    const waiter = await this.waiterRepo.findOne({ where: { id } });
    if (!waiter) throw new NotFoundException('Waiter not found');

    waiter.isActive = isActive;
    return this.waiterRepo.save(waiter);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FloorEntity } from './floor.entity';
import { CreateFloorDto } from './dto/create-floor.dto';

@Injectable()
export class FloorsService {
  constructor(
    @InjectRepository(FloorEntity)
    private floorRepo: Repository<FloorEntity>,
  ) {}

  async create(dto: CreateFloorDto) {
    return this.floorRepo.save(dto);
  }

  async findAll() {
    return this.floorRepo.find();
  }

  async findById(id: number) {
    return this.floorRepo.findOne({ where: { id } });
  }
}

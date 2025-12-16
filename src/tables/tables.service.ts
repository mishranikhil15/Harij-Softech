import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from './table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { AssignTableDto } from './dto/assign-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(TableEntity)
    private tableRepo: Repository<TableEntity>,
  ) {}

  async create(dto: CreateTableDto) {
    return this.tableRepo.save(dto);
  }

  async findAll() {
    return this.tableRepo.find();
  }

  async findByFloor(floorId: number) {
    return this.tableRepo.find({ where: { floorId } });
  }

  async findById(id: number) {
    return this.tableRepo.findOne({ where: { id } });
  }

  async assignToWaiter(tableId: number, dto: AssignTableDto) {
    const table = await this.findById(tableId);
    if (!table) throw new NotFoundException('Table not found');

    table.waiterId = dto.waiterId;
    table.status = 'OCCUPIED';
    return this.tableRepo.save(table);
  }

  async getWaiterTables(waiterId: number) {
    return this.tableRepo.find({ where: { waiterId } });
  }

  async unassignTable(tableId: number) {
    const table = await this.findById(tableId);
    if (!table) throw new NotFoundException('Table not found');

    table.waiterId = null as any;
    table.status = 'VACANT';
    return this.tableRepo.save(table);
  }
}

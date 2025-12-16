import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { AssignTableDto } from './dto/assign-table.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.tablesService.findAll();
  }

  @Get('floor/:floorId')
  @UseGuards(JwtAuthGuard)
  async findByFloor(@Param('floorId') floorId: string) {
    return this.tablesService.findByFloor(parseInt(floorId));
  }

  @Get('waiter/:waiterId')
  @UseGuards(JwtAuthGuard)
  async getWaiterTables(@Param('waiterId') waiterId: string) {
    return this.tablesService.getWaiterTables(parseInt(waiterId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.tablesService.findById(parseInt(id));
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard)
  async assignToWaiter(
    @Param('id') id: string,
    @Body() dto: AssignTableDto,
  ) {
    return this.tablesService.assignToWaiter(parseInt(id), dto);
  }

  @Patch(':id/unassign')
  @UseGuards(JwtAuthGuard)
  async unassignTable(@Param('id') id: string) {
    return this.tablesService.unassignTable(parseInt(id));
  }
}

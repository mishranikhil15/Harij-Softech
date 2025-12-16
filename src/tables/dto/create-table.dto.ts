import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

export enum TableStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
}

export class CreateTableDto {
  @IsNumber()
  @IsNotEmpty()
  floorId: number;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsEnum(TableStatus)
  status: TableStatus = TableStatus.VACANT;
}

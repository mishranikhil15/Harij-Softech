import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignTableDto {
  @IsNumber()
  @IsNotEmpty()
  waiterId: number;
}

import { IsNumber, IsNotEmpty } from 'class-validator';

export class GenerateQrDto {
  @IsNumber()
  @IsNotEmpty()
  waiterId: number;
}

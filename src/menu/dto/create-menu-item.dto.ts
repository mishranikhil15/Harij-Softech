import { IsNumber, IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  available: boolean = true;

  @IsString()
  @IsOptional()
  image?: string;
}

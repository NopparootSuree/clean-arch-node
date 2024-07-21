import { IsString, IsNumber, IsOptional, Min, IsDate } from 'class-validator';

export class UpdateMaterialDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsDate()
  createdAt: Date;
}

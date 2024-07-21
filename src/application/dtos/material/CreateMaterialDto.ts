import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMaterialDto {
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
}

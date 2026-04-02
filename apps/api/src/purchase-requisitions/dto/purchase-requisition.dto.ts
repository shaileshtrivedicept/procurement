import { IsNotEmpty, IsString, IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from '@prisma/client';

class CreatePRItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

export class CreatePRDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePRItemDto)
  items: CreatePRItemDto[];
}

import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({ description: 'Product name', example: 'Laptop Dell' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  nome: string;

  @ApiProperty({ description: 'Product description', required: false, example: 'High performance laptop' })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Product price', example: 2500.99 })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  preco: number;

  @ApiProperty({ description: 'Client ID', example: 1 })
  @IsInt({ message: 'Client ID must be an integer' })
  @IsPositive({ message: 'Client ID must be positive' })
  clienteId: number;
}
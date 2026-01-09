import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ description: 'Client name', example: 'John Doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  nome: string;

  @ApiProperty({ description: 'Client email', example: 'john@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  @Length(5, 150, { message: 'Email must be between 5 and 150 characters' })
  email: string;

  @ApiProperty({ description: 'Client phone', required: false, example: '11999999999' })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Length(10, 20, { message: 'Phone must be between 10 and 20 characters' })
  telefone?: string;

  @ApiProperty({ description: 'Client CPF', required: false, example: '12345678901' })
  @IsOptional()
  @IsString({ message: 'CPF must be a string' })
  @Length(11, 14, { message: 'CPF must be between 11 and 14 characters' })
  cpf?: string;
}
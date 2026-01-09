import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  private readonly MAX_LIMIT = 100; // Limite máximo por página
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_PAGE = 1;

  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async createClient(@Body(ValidationPipe) createClienteDto: CreateClienteDto) {
    return await this.clienteService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'List clients with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (min: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: `Items per page (max: ${100})` })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email or CPF' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field: nome, email, createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order: ASC, DESC' })
  async getClients(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    // Validação e sanitização dos parâmetros
    const validatedPage = this.validatePage(page);
    const validatedLimit = this.validateLimit(limit);
    const validatedSearch = this.validateSearch(search);
    const validatedSort = this.validateSort(sortBy, sortOrder);

    return await this.clienteService.findAll(
      validatedPage,
      validatedLimit,
      validatedSearch,
      validatedSort.sortBy,
      validatedSort.sortOrder
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find client by ID' })
  @ApiResponse({ status: 200, description: 'Client found' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async getClientById(@Param('id', ParseIntPipe) id: number) {
    return await this.clienteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateClienteDto: UpdateClienteDto,
  ) {
    return await this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async deleteClient(@Param('id', ParseIntPipe) id: number) {
    return await this.clienteService.remove(id);
  }

  private validatePage(page?: number): number {
    if (!page || page < 1) {
      return this.DEFAULT_PAGE;
    }
    if (page > 10000) { // Limite máximo de páginas
      throw new BadRequestException('Page number too high (max: 10000)');
    }
    return page;
  }

  private validateLimit(limit?: number): number {
    if (!limit || limit < 1) {
      return this.DEFAULT_LIMIT;
    }
    if (limit > this.MAX_LIMIT) {
      throw new BadRequestException(`Limit too high (max: ${this.MAX_LIMIT})`);
    }
    return limit;
  }

  private validateSearch(search?: string): string | undefined {
    if (!search) return undefined;
    
    const trimmed = search.trim();
    if (trimmed.length > 100) { // Limite de caracteres na busca
      throw new BadRequestException('Search term too long (max: 100 characters)');
    }
    if (trimmed.length < 2) { // Mínimo de caracteres para busca
      throw new BadRequestException('Search term too short (min: 2 characters)');
    }
    return trimmed;
  }

  private validateSort(sortBy?: string, sortOrder?: string) {
    const allowedSortFields = ['nome', 'email', 'createdAt', 'updatedAt'];
    const allowedSortOrders = ['ASC', 'DESC'];

    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = allowedSortOrders.includes(sortOrder) ? sortOrder as 'ASC' | 'DESC' : 'DESC';

    return { sortBy: validSortBy, sortOrder: validSortOrder };
  }
}
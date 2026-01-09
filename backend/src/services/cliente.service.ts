import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  private readonly MAX_SEARCH_RESULTS = 1000; // Limite máximo de resultados

  constructor(
    @InjectModel(Cliente)
    private clienteModel: typeof Cliente,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    return await this.clienteModel.create(createClienteDto);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    const offset = (page - 1) * limit;
    
    const whereCondition = this.buildSearchCondition(search);

    // Verifica se a consulta pode retornar muitos resultados
    if (!search && page * limit > this.MAX_SEARCH_RESULTS) {
      throw new BadRequestException(
        `Cannot retrieve more than ${this.MAX_SEARCH_RESULTS} records. Use search filters to narrow results.`
      );
    }

    const { count, rows } = await this.clienteModel.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order: [[sortBy, sortOrder]],
      attributes: { exclude: ['cpf'] }, // Remove dados sensíveis por padrão
      logging: false, // Desabilita logs SQL em produção
    });

    // Limita o total de páginas retornadas
    const maxPages = Math.ceil(this.MAX_SEARCH_RESULTS / limit);
    const totalPages = Math.min(Math.ceil(count / Number(limit)), maxPages);

    return {
      data: rows,
      total: Math.min(count, this.MAX_SEARCH_RESULTS),
      page: Number(page),
      totalPages,
      limit: Number(limit),
      hasMore: count > this.MAX_SEARCH_RESULTS,
      filters: {
        search: search || null,
        sortBy,
        sortOrder
      }
    };
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteModel.findByPk(id, {
      attributes: { exclude: [] }, // Inclui todos os campos para busca por ID
    });
    if (!cliente) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    return await cliente.update(updateClienteDto);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    await cliente.destroy();
  }

  private buildSearchCondition(search?: string) {
    if (!search || !search.trim()) {
      return {};
    }
    
    const searchTerm = search.trim();
    
    // Sanitização básica para prevenir injection
    const sanitizedTerm = searchTerm.replace(/[%_\\]/g, '\\$&');
    
    return {
      [Op.or]: [
        { nome: { [Op.like]: `%${sanitizedTerm}%` } },
        { email: { [Op.like]: `%${sanitizedTerm}%` } },
        // CPF removido da busca por questões de segurança
      ]
    };
  }

  // Método para busca avançada com mais filtros
  async findWithAdvancedFilters(filters: {
    page?: number;
    limit?: number;
    nome?: string;
    email?: string;
    createdAfter?: Date;
    createdBefore?: Date;
  }) {
    const { page = 1, limit = 10, nome, email, createdAfter, createdBefore } = filters;
    const offset = (page - 1) * limit;

    const whereConditions: any = {};

    if (nome) {
      whereConditions.nome = { [Op.like]: `%${nome}%` };
    }

    if (email) {
      whereConditions.email = { [Op.like]: `%${email}%` };
    }

    if (createdAfter || createdBefore) {
      whereConditions.createdAt = {};
      if (createdAfter) {
        whereConditions.createdAt[Op.gte] = createdAfter;
      }
      if (createdBefore) {
        whereConditions.createdAt[Op.lte] = createdBefore;
      }
    }

    const { count, rows } = await this.clienteModel.findAndCountAll({
      where: whereConditions,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['cpf'] },
    });

    return {
      data: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      appliedFilters: filters
    };
  }
}
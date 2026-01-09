import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectModel(Cliente)
    private clienteModel: typeof Cliente,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    return await this.clienteModel.create(createClienteDto);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;
    
    const whereCondition = this.buildSearchCondition(search);

    const { count, rows } = await this.clienteModel.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']]
    });

    return {
      data: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    };
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteModel.findByPk(id);
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
    return {
      [Op.or]: [
        { nome: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
        { cpf: { [Op.like]: `%${searchTerm}%` } }
      ]
    };
  }
}
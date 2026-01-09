import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Produto } from '../entities/produto.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectModel(Produto)
    private produtoModel: typeof Produto,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return await this.produtoModel.create(createProdutoDto);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;
    
    const whereCondition = this.buildSearchCondition(search);

    const { count, rows } = await this.produtoModel.findAndCountAll({
      where: whereCondition,
      include: [{ model: Cliente, attributes: ['id', 'nome'] }],
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

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoModel.findByPk(id, {
      include: [{ model: Cliente, attributes: ['id', 'nome'] }]
    });
    if (!produto) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    return await produto.update(updateProdutoDto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await produto.destroy();
  }

  private buildSearchCondition(search?: string) {
    if (!search || !search.trim()) {
      return {};
    }
    
    const searchTerm = search.trim();
    return {
      [Op.or]: [
        { nome: { [Op.like]: `%${searchTerm}%` } },
        { descricao: { [Op.like]: `%${searchTerm}%` } }
      ]
    };
  }
}
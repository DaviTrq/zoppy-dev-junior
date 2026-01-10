import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { ProdutoService } from './produto.service';
import { Produto } from '../entities/produto.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let mockProdutoModel: any;

  const mockProduto = {
    id: 1,
    nome: 'Produto Teste',
    descricao: 'Descrição do produto',
    preco: 99.99,
    clienteId: 1,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockProdutoModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getModelToken(Produto),
          useValue: mockProdutoModel,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a produto', async () => {
      const createProdutoDto: CreateProdutoDto = {
        nome: 'Produto Teste',
        descricao: 'Descrição do produto',
        preco: 99.99,
        clienteId: 1,
      };

      mockProdutoModel.create.mockResolvedValue(mockProduto);

      const result = await service.create(createProdutoDto);

      expect(mockProdutoModel.create).toHaveBeenCalledWith(createProdutoDto);
      expect(result).toEqual(mockProduto);
    });
  });

  describe('findAll', () => {
    it('should return paginated produtos without search', async () => {
      const mockResponse = {
        count: 1,
        rows: [mockProduto],
      };

      mockProdutoModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(1, 10);

      expect(mockProdutoModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        include: [{ model: Cliente, attributes: ['id', 'nome'] }],
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });

      expect(result).toEqual({
        data: [mockProduto],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should return paginated produtos with search', async () => {
      const mockResponse = {
        count: 1,
        rows: [mockProduto],
      };

      mockProdutoModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(1, 10, 'Produto');

      expect(mockProdutoModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: '%Produto%' } },
            { descricao: { [Op.like]: '%Produto%' } },
          ],
        },
        include: [{ model: Cliente, attributes: ['id', 'nome'] }],
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });

      expect(result.data).toEqual([mockProduto]);
    });
  });

  describe('findOne', () => {
    it('should return a produto by id', async () => {
      mockProdutoModel.findByPk.mockResolvedValue(mockProduto);

      const result = await service.findOne(1);

      expect(mockProdutoModel.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Cliente, attributes: ['id', 'nome'] }],
      });
      expect(result).toEqual(mockProduto);
    });

    it('should throw NotFoundException when produto not found', async () => {
      mockProdutoModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Product with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update a produto', async () => {
      const updateProdutoDto: UpdateProdutoDto = {
        nome: 'Produto Atualizado',
      };

      mockProdutoModel.findByPk.mockResolvedValue(mockProduto);
      mockProduto.update.mockResolvedValue({ ...mockProduto, ...updateProdutoDto });

      const result = await service.update(1, updateProdutoDto);

      expect(mockProdutoModel.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Cliente, attributes: ['id', 'nome'] }],
      });
      expect(mockProduto.update).toHaveBeenCalledWith(updateProdutoDto);
      expect(result.nome).toBe('Produto Atualizado');
    });

    it('should throw NotFoundException when updating non-existent produto', async () => {
      mockProdutoModel.findByPk.mockResolvedValue(null);

      await expect(service.update(999, { nome: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a produto', async () => {
      mockProdutoModel.findByPk.mockResolvedValue(mockProduto);
      mockProduto.destroy.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockProdutoModel.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Cliente, attributes: ['id', 'nome'] }],
      });
      expect(mockProduto.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when removing non-existent produto', async () => {
      mockProdutoModel.findByPk.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('buildSearchCondition', () => {
    it('should return empty object when search is empty', async () => {
      mockProdutoModel.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });
      
      await service.findAll(1, 10, '');
      
      expect(mockProdutoModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
    });

    it('should filter by price range', async () => {
      mockProdutoModel.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockProduto] });
      
      await service.findAll(1, 10, undefined, 10, 100);
      
      expect(mockProdutoModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            preco: {
              [Op.gte]: 10,
              [Op.lte]: 100
            }
          }
        })
      );
    });

    it('should filter by clienteId', async () => {
      mockProdutoModel.findAndCountAll.mockResolvedValue({ count: 1, rows: [mockProduto] });
      
      await service.findAll(1, 10, undefined, undefined, undefined, 1);
      
      expect(mockProdutoModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clienteId: 1 }
        })
      );
    });
  });
});
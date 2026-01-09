import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../entities/cliente.entity';

describe('ClienteService', () => {
  let service: ClienteService;
  let mockClienteModel: any;

  const mockCliente = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    cpf: '12345678901',
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockClienteModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getModelToken(Cliente),
          useValue: mockClienteModel,
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cliente', async () => {
      const createDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        cpf: '12345678901',
      };

      mockClienteModel.create.mockResolvedValue(mockCliente);

      const result = await service.create(createDto);

      expect(mockClienteModel.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('findAll', () => {
    it('should return paginated clientes', async () => {
      const mockResult = {
        count: 1,
        rows: [mockCliente],
      };

      mockClienteModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: [mockCliente],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a cliente', async () => {
      mockClienteModel.findByPk.mockResolvedValue(mockCliente);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCliente);
    });

    it('should throw NotFoundException when cliente not found', async () => {
      mockClienteModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cliente', async () => {
      const updateDto = { nome: 'João Santos' };
      mockClienteModel.findByPk.mockResolvedValue(mockCliente);
      mockCliente.update.mockResolvedValue({ ...mockCliente, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(mockCliente.update).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a cliente', async () => {
      mockClienteModel.findByPk.mockResolvedValue(mockCliente);

      await service.remove(1);

      expect(mockCliente.destroy).toHaveBeenCalled();
    });
  });
});
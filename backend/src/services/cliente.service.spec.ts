import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

describe('ClienteService', () => {
  let service: ClienteService;
  let mockClienteModel: any;

  const mockCliente = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@teste.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
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
      const createClienteDto: CreateClienteDto = {
        nome: 'João Silva',
        email: 'joao@teste.com',
        telefone: '(11) 99999-9999',
        cpf: '123.456.789-00',
      };

      mockClienteModel.create.mockResolvedValue(mockCliente);

      const result = await service.create(createClienteDto);

      expect(mockClienteModel.create).toHaveBeenCalledWith(createClienteDto);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('findAll', () => {
    it('should return paginated clientes without search', async () => {
      const mockResponse = {
        count: 1,
        rows: [mockCliente],
      };

      mockClienteModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(1, 10);

      expect(mockClienteModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });

      expect(result).toEqual({
        data: [mockCliente],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should return paginated clientes with search', async () => {
      const mockResponse = {
        count: 1,
        rows: [mockCliente],
      };

      mockClienteModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(1, 10, 'João');

      expect(mockClienteModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          $or: [
            { nome: { $like: '%João%' } },
            { email: { $like: '%João%' } },
            { cpf: { $like: '%João%' } },
          ],
        },
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });

      expect(result.data).toEqual([mockCliente]);
    });
  });

  describe('findOne', () => {
    it('should return a cliente by id', async () => {
      mockClienteModel.findByPk.mockResolvedValue(mockCliente);

      const result = await service.findOne(1);

      expect(mockClienteModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCliente);
    });

    it('should throw NotFoundException when cliente not found', async () => {
      mockClienteModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Cliente 999 não encontrado');
    });
  });

  describe('update', () => {
    it('should update a cliente', async () => {
      const updateClienteDto: UpdateClienteDto = {
        nome: 'João Silva Atualizado',
      };

      mockClienteModel.findByPk.mockResolvedValue(mockCliente);
      mockCliente.update.mockResolvedValue({ ...mockCliente, ...updateClienteDto });

      const result = await service.update(1, updateClienteDto);

      expect(mockClienteModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCliente.update).toHaveBeenCalledWith(updateClienteDto);
      expect(result.nome).toBe('João Silva Atualizado');
    });

    it('should throw NotFoundException when updating non-existent cliente', async () => {
      mockClienteModel.findByPk.mockResolvedValue(null);

      await expect(service.update(999, { nome: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a cliente', async () => {
      mockClienteModel.findByPk.mockResolvedValue(mockCliente);
      mockCliente.destroy.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockClienteModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCliente.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when removing non-existent cliente', async () => {
      mockClienteModel.findByPk.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

describe('ClienteController', () => {
  let controller: ClienteController;
  let service: ClienteService;

  const mockCliente = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@teste.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
  };

  const mockClienteService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
          useValue: mockClienteService,
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
    service = module.get<ClienteService>(ClienteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cliente', async () => {
      const createClienteDto: CreateClienteDto = {
        nome: 'João Silva',
        email: 'joao@teste.com',
        telefone: '(11) 99999-9999',
        cpf: '123.456.789-00',
      };

      mockClienteService.create.mockResolvedValue(mockCliente);

      const result = await controller.createClient(createClienteDto);

      expect(service.create).toHaveBeenCalledWith(createClienteDto);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('findAll', () => {
    it('should return all clientes', async () => {
      const mockResponse = {
        data: [mockCliente],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockClienteService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.getClients(1, 10, 'João');

      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'João', 'createdAt', 'DESC');
      expect(result).toEqual(mockResponse);
    });

    it('should return all clientes with default params', async () => {
      const mockResponse = {
        data: [mockCliente],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockClienteService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.getClients();

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, 'createdAt', 'DESC');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a cliente by id', async () => {
      mockClienteService.findOne.mockResolvedValue(mockCliente);

      const result = await controller.getClientById(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('update', () => {
    it('should update a cliente', async () => {
      const updateClienteDto: UpdateClienteDto = {
        nome: 'João Silva Atualizado',
      };

      const updatedCliente = { ...mockCliente, ...updateClienteDto };
      mockClienteService.update.mockResolvedValue(updatedCliente);

      const result = await controller.updateClient(1, updateClienteDto);

      expect(service.update).toHaveBeenCalledWith(1, updateClienteDto);
      expect(result).toEqual(updatedCliente);
    });
  });

  describe('remove', () => {
    it('should remove a cliente', async () => {
      mockClienteService.remove.mockResolvedValue(undefined);

      await controller.deleteClient(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('validation methods', () => {
    it('should handle invalid search parameters', async () => {
      const mockResponse = {
        data: [mockCliente],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockClienteService.findAll.mockResolvedValue(mockResponse);

      // Test with undefined parameters
      await controller.getClients(undefined, undefined, undefined, undefined, undefined);
      
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, 'createdAt', 'DESC');
    });
  });
});
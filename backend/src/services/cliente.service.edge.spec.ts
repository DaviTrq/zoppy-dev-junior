import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from '../entities/cliente.entity';

describe('ClienteService Edge Cases', () => {
  let service: ClienteService;
  let mockClienteModel: any;

  beforeEach(async () => {
    mockClienteModel = {
      findAndCountAll: jest.fn(),
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

  it('should throw BadRequestException when page limit exceeded', async () => {
    mockClienteModel.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });
    
    await expect(service.findAll(1001, 10)).rejects.toThrow(BadRequestException);
    await expect(service.findAll(1001, 10)).rejects.toThrow('Cannot retrieve more than 1000 records');
  });

  it('should handle hasMore flag correctly', async () => {
    mockClienteModel.findAndCountAll.mockResolvedValue({ count: 1500, rows: [] });
    
    const result = await service.findAll(1, 10, 'test');
    
    expect(result.hasMore).toBe(true);
    expect(result.total).toBe(1000); // Should be capped at MAX_SEARCH_RESULTS
  });
});
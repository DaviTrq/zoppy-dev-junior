import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from '../services/cliente.service';

describe('ClienteController Integration', () => {
  let controller: ClienteController;
  let service: ClienteService;

  const mockClienteService = {
    findAll: jest.fn(),
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

  describe('validation edge cases', () => {
    it('should handle page validation - high values', async () => {
      mockClienteService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      try {
        await controller.getClients(10001, 10, undefined, undefined, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Page number too high');
      }
    });

    it('should handle limit validation - high values', async () => {
      mockClienteService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      try {
        await controller.getClients(1, 101, undefined, undefined, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Limit too high');
      }
    });

    it('should throw BadRequestException when search is too long', async () => {
      mockClienteService.findAll.mockResolvedValue({ data: [], total: 0 });
      const longSearch = 'a'.repeat(101);
      
      try {
        await controller.getClients(1, 10, longSearch, undefined, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Search term too long');
      }
    });

    it('should throw BadRequestException when search is too short', async () => {
      mockClienteService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      try {
        await controller.getClients(1, 10, 'a', undefined, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Search term too short');
      }
    });

    it('should handle invalid sort parameters', async () => {
      mockClienteService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      await controller.getClients(1, 10, undefined, 'invalid', 'INVALID' as any);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, 'createdAt', 'DESC');
    });

    it('should handle zero and negative values', async () => {
      mockClienteService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      await controller.getClients(0, 0, undefined, undefined, undefined);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, 'createdAt', 'DESC');
    });
  });
});
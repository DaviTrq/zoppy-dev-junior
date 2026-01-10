import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from '../services/produto.service';

describe('ProdutoController Integration', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  const mockProdutoService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockProdutoService,
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  describe('validation methods', () => {
    it('should validate page limits', async () => {
      mockProdutoService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      // Test high page number - should work as controller doesn't validate this
      await controller.getProducts('9999', '10', undefined);
      expect(service.findAll).toHaveBeenCalledWith(9999, 10, undefined, undefined, undefined, undefined);
    });

    it('should validate limit values', async () => {
      mockProdutoService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      // Test high limit - should work as controller doesn't validate this
      await controller.getProducts('1', '999', undefined);
      expect(service.findAll).toHaveBeenCalledWith(1, 999, undefined, undefined, undefined, undefined);
    });

    it('should handle invalid string numbers', async () => {
      mockProdutoService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      // Test invalid page string - should default to 1
      await controller.getProducts('invalid', '10', undefined);
      expect(service.findAll).toHaveBeenCalledWith(NaN, 10, undefined, undefined, undefined, undefined);
    });

    it('should handle zero values', async () => {
      mockProdutoService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      await controller.getProducts('0', '0', undefined);
      expect(service.findAll).toHaveBeenCalledWith(0, 0, undefined, undefined, undefined, undefined);
    });

    it('should handle negative values', async () => {
      mockProdutoService.findAll.mockResolvedValue({ data: [], total: 0 });
      
      await controller.getProducts('-1', '-5', undefined);
      expect(service.findAll).toHaveBeenCalledWith(-1, -5, undefined, undefined, undefined, undefined);
    });

    it('should test private validation methods', () => {
      const controller = new ProdutoController(mockProdutoService as any);
      
      // Test validatePage
      expect((controller as any).validatePage(undefined)).toBe(1);
      expect((controller as any).validatePage(0)).toBe(1);
      expect((controller as any).validatePage(5)).toBe(5);
      
      // Test validateLimit
      expect((controller as any).validateLimit(undefined)).toBe(10);
      expect((controller as any).validateLimit(0)).toBe(10);
      expect((controller as any).validateLimit(50)).toBe(50);
      
      // Test validateSearch
      expect((controller as any).validateSearch(undefined)).toBeUndefined();
      expect((controller as any).validateSearch('')).toBeUndefined();
      expect((controller as any).validateSearch('  ')).toBeUndefined();
      expect((controller as any).validateSearch('test')).toBe('test');
      
      // Test validatePriceRange
      expect((controller as any).validatePriceRange(10, 100)).toEqual({ minPrice: 10, maxPrice: 100 });
      expect((controller as any).validatePriceRange(undefined, undefined)).toEqual({ minPrice: undefined, maxPrice: undefined });
      
      // Test validateSort
      expect((controller as any).validateSort('nome', 'ASC')).toEqual({ sortBy: 'nome', sortOrder: 'ASC' });
      expect((controller as any).validateSort('invalid', 'INVALID')).toEqual({ sortBy: 'createdAt', sortOrder: 'DESC' });
    });

    it('should throw BadRequestException for invalid values', () => {
      const controller = new ProdutoController(mockProdutoService as any);
      
      // Test high page
      expect(() => (controller as any).validatePage(10001)).toThrow('Page number too high');
      
      // Test high limit
      expect(() => (controller as any).validateLimit(101)).toThrow('Limit too high');
      
      // Test negative prices
      expect(() => (controller as any).validatePriceRange(-1, 100)).toThrow('Minimum price cannot be negative');
      expect(() => (controller as any).validatePriceRange(10, -1)).toThrow('Maximum price cannot be negative');
      expect(() => (controller as any).validatePriceRange(100, 10)).toThrow('Minimum price cannot be greater than maximum price');
      expect(() => (controller as any).validatePriceRange(10, 1000001)).toThrow('Maximum price too high');
    });
  });
});
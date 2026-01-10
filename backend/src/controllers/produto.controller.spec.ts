import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from '../services/produto.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  const mockProduto = {
    id: 1,
    nome: 'Produto Teste',
    descricao: 'Descrição do produto',
    preco: 99.99,
    clienteId: 1,
  };

  const mockProdutoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a produto', async () => {
      const createProdutoDto: CreateProdutoDto = {
        nome: 'Produto Teste',
        descricao: 'Descrição do produto',
        preco: 99.99,
        clienteId: 1,
      };

      mockProdutoService.create.mockResolvedValue(mockProduto);

      const result = await controller.createProduct(createProdutoDto);

      expect(service.create).toHaveBeenCalledWith(createProdutoDto);
      expect(result).toEqual(mockProduto);
    });
  });

  describe('findAll', () => {
    it('should return all produtos', async () => {
      const mockResponse = {
        data: [mockProduto],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockProdutoService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.getProducts('1', '10', 'Produto');

      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Produto', undefined, undefined, undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should return all produtos with default params', async () => {
      const mockResponse = {
        data: [mockProduto],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockProdutoService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.getProducts();

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a produto by id', async () => {
      mockProdutoService.findOne.mockResolvedValue(mockProduto);

      const result = await controller.getProductById(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduto);
    });
  });

  describe('update', () => {
    it('should update a produto', async () => {
      const updateProdutoDto: UpdateProdutoDto = {
        nome: 'Produto Atualizado',
      };

      const updatedProduto = { ...mockProduto, ...updateProdutoDto };
      mockProdutoService.update.mockResolvedValue(updatedProduto);

      const result = await controller.updateProduct('1', updateProdutoDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProdutoDto);
      expect(result).toEqual(updatedProduto);
    });
  });

  describe('remove', () => {
    it('should remove a produto', async () => {
      mockProdutoService.remove.mockResolvedValue(undefined);

      await controller.deleteProduct(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('validation methods', () => {
    it('should handle string parameters correctly', async () => {
      const mockResponse = {
        data: [mockProduto],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockProdutoService.findAll.mockResolvedValue(mockResponse);

      // Test with string parameters
      await controller.getProducts('2', '5', 'test');
      
      expect(service.findAll).toHaveBeenCalledWith(2, 5, 'test', undefined, undefined, undefined);
    });

    it('should handle undefined parameters', async () => {
      const mockResponse = {
        data: [mockProduto],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockProdutoService.findAll.mockResolvedValue(mockResponse);

      await controller.getProducts(undefined, undefined, undefined);
      
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined);
    });
  });
});
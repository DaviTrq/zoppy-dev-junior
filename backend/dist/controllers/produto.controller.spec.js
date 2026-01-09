"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const produto_controller_1 = require("./produto.controller");
const produto_service_1 = require("../services/produto.service");
describe('ProdutoController', () => {
    let controller;
    let service;
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
        const module = await testing_1.Test.createTestingModule({
            controllers: [produto_controller_1.ProdutoController],
            providers: [
                {
                    provide: produto_service_1.ProdutoService,
                    useValue: mockProdutoService,
                },
            ],
        }).compile();
        controller = module.get(produto_controller_1.ProdutoController);
        service = module.get(produto_service_1.ProdutoService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a produto', async () => {
            const createProdutoDto = {
                nome: 'Produto Teste',
                descricao: 'Descrição do produto',
                preco: 99.99,
                clienteId: 1,
            };
            mockProdutoService.create.mockResolvedValue(mockProduto);
            const result = await controller.create(createProdutoDto);
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
            const result = await controller.findAll(1, 10, 'Produto');
            expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Produto');
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
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });
    });
    describe('findOne', () => {
        it('should return a produto by id', async () => {
            mockProdutoService.findOne.mockResolvedValue(mockProduto);
            const result = await controller.findOne(1);
            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockProduto);
        });
    });
    describe('update', () => {
        it('should update a produto', async () => {
            const updateProdutoDto = {
                nome: 'Produto Atualizado',
            };
            const updatedProduto = { ...mockProduto, ...updateProdutoDto };
            mockProdutoService.update.mockResolvedValue(updatedProduto);
            const result = await controller.update(1, updateProdutoDto);
            expect(service.update).toHaveBeenCalledWith(1, updateProdutoDto);
            expect(result).toEqual(updatedProduto);
        });
    });
    describe('remove', () => {
        it('should remove a produto', async () => {
            mockProdutoService.remove.mockResolvedValue(undefined);
            await controller.remove(1);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
//# sourceMappingURL=produto.controller.spec.js.map
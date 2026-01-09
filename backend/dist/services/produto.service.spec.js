"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sequelize_1 = require("@nestjs/sequelize");
const common_1 = require("@nestjs/common");
const produto_service_1 = require("./produto.service");
const produto_entity_1 = require("../entities/produto.entity");
const cliente_entity_1 = require("../entities/cliente.entity");
describe('ProdutoService', () => {
    let service;
    let mockProdutoModel;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                produto_service_1.ProdutoService,
                {
                    provide: (0, sequelize_1.getModelToken)(produto_entity_1.Produto),
                    useValue: mockProdutoModel,
                },
            ],
        }).compile();
        service = module.get(produto_service_1.ProdutoService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('should create a produto', async () => {
            const createProdutoDto = {
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
                include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }],
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
                    $or: [
                        { nome: { $like: '%Produto%' } },
                        { descricao: { $like: '%Produto%' } },
                    ],
                },
                include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }],
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
                include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }],
            });
            expect(result).toEqual(mockProduto);
        });
        it('should throw NotFoundException when produto not found', async () => {
            mockProdutoModel.findByPk.mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toThrow(common_1.NotFoundException);
            await expect(service.findOne(999)).rejects.toThrow('Produto 999 não encontrado');
        });
    });
    describe('update', () => {
        it('should update a produto', async () => {
            const updateProdutoDto = {
                nome: 'Produto Atualizado',
            };
            mockProdutoModel.findByPk.mockResolvedValue(mockProduto);
            mockProduto.update.mockResolvedValue({ ...mockProduto, ...updateProdutoDto });
            const result = await service.update(1, updateProdutoDto);
            expect(mockProdutoModel.findByPk).toHaveBeenCalledWith(1, {
                include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }],
            });
            expect(mockProduto.update).toHaveBeenCalledWith(updateProdutoDto);
            expect(result.nome).toBe('Produto Atualizado');
        });
        it('should throw NotFoundException when updating non-existent produto', async () => {
            mockProdutoModel.findByPk.mockResolvedValue(null);
            await expect(service.update(999, { nome: 'Test' })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should remove a produto', async () => {
            mockProdutoModel.findByPk.mockResolvedValue(mockProduto);
            mockProduto.destroy.mockResolvedValue(undefined);
            await service.remove(1);
            expect(mockProdutoModel.findByPk).toHaveBeenCalledWith(1, {
                include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }],
            });
            expect(mockProduto.destroy).toHaveBeenCalled();
        });
        it('should throw NotFoundException when removing non-existent produto', async () => {
            mockProdutoModel.findByPk.mockResolvedValue(null);
            await expect(service.remove(999)).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=produto.service.spec.js.map
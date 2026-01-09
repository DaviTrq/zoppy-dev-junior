"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sequelize_1 = require("@nestjs/sequelize");
const common_1 = require("@nestjs/common");
const cliente_service_1 = require("../services/cliente.service");
const cliente_entity_1 = require("../entities/cliente.entity");
describe('ClienteService', () => {
    let service;
    let mockClienteModel;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                cliente_service_1.ClienteService,
                {
                    provide: (0, sequelize_1.getModelToken)(cliente_entity_1.Cliente),
                    useValue: mockClienteModel,
                },
            ],
        }).compile();
        service = module.get(cliente_service_1.ClienteService);
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
            await expect(service.findOne(1)).rejects.toThrow(common_1.NotFoundException);
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
//# sourceMappingURL=cliente.service.spec.js.map
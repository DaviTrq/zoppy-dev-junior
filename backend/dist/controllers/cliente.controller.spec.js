"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const cliente_controller_1 = require("./cliente.controller");
const cliente_service_1 = require("../services/cliente.service");
describe('ClienteController', () => {
    let controller;
    let service;
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
        const module = await testing_1.Test.createTestingModule({
            controllers: [cliente_controller_1.ClienteController],
            providers: [
                {
                    provide: cliente_service_1.ClienteService,
                    useValue: mockClienteService,
                },
            ],
        }).compile();
        controller = module.get(cliente_controller_1.ClienteController);
        service = module.get(cliente_service_1.ClienteService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a cliente', async () => {
            const createClienteDto = {
                nome: 'João Silva',
                email: 'joao@teste.com',
                telefone: '(11) 99999-9999',
                cpf: '123.456.789-00',
            };
            mockClienteService.create.mockResolvedValue(mockCliente);
            const result = await controller.create(createClienteDto);
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
            const result = await controller.findAll(1, 10, 'João');
            expect(service.findAll).toHaveBeenCalledWith(1, 10, 'João');
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
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });
    });
    describe('findOne', () => {
        it('should return a cliente by id', async () => {
            mockClienteService.findOne.mockResolvedValue(mockCliente);
            const result = await controller.findOne(1);
            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockCliente);
        });
    });
    describe('update', () => {
        it('should update a cliente', async () => {
            const updateClienteDto = {
                nome: 'João Silva Atualizado',
            };
            const updatedCliente = { ...mockCliente, ...updateClienteDto };
            mockClienteService.update.mockResolvedValue(updatedCliente);
            const result = await controller.update(1, updateClienteDto);
            expect(service.update).toHaveBeenCalledWith(1, updateClienteDto);
            expect(result).toEqual(updatedCliente);
        });
    });
    describe('remove', () => {
        it('should remove a cliente', async () => {
            mockClienteService.remove.mockResolvedValue(undefined);
            await controller.remove(1);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
//# sourceMappingURL=cliente.controller.spec.js.map
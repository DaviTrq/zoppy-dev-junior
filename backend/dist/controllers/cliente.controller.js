"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cliente_service_1 = require("../services/cliente.service");
const create_cliente_dto_1 = require("../dto/create-cliente.dto");
const update_cliente_dto_1 = require("../dto/update-cliente.dto");
let ClienteController = class ClienteController {
    constructor(clienteService) {
        this.clienteService = clienteService;
        this.MAX_LIMIT = 100;
        this.DEFAULT_LIMIT = 10;
        this.DEFAULT_PAGE = 1;
    }
    async createClient(createClienteDto) {
        return await this.clienteService.create(createClienteDto);
    }
    async getClients(page, limit, search, sortBy, sortOrder) {
        const validatedPage = this.validatePage(page);
        const validatedLimit = this.validateLimit(limit);
        const validatedSearch = this.validateSearch(search);
        const validatedSort = this.validateSort(sortBy, sortOrder);
        return await this.clienteService.findAll(validatedPage, validatedLimit, validatedSearch, validatedSort.sortBy, validatedSort.sortOrder);
    }
    async getClientById(id) {
        return await this.clienteService.findOne(id);
    }
    async updateClient(id, updateClienteDto) {
        return await this.clienteService.update(id, updateClienteDto);
    }
    async deleteClient(id) {
        return await this.clienteService.remove(id);
    }
    validatePage(page) {
        if (!page || page < 1) {
            return this.DEFAULT_PAGE;
        }
        if (page > 10000) {
            throw new common_1.BadRequestException('Page number too high (max: 10000)');
        }
        return page;
    }
    validateLimit(limit) {
        if (!limit || limit < 1) {
            return this.DEFAULT_LIMIT;
        }
        if (limit > this.MAX_LIMIT) {
            throw new common_1.BadRequestException(`Limit too high (max: ${this.MAX_LIMIT})`);
        }
        return limit;
    }
    validateSearch(search) {
        if (!search)
            return undefined;
        const trimmed = search.trim();
        if (trimmed.length > 100) {
            throw new common_1.BadRequestException('Search term too long (max: 100 characters)');
        }
        if (trimmed.length < 2) {
            throw new common_1.BadRequestException('Search term too short (min: 2 characters)');
        }
        return trimmed;
    }
    validateSort(sortBy, sortOrder) {
        const allowedSortFields = ['nome', 'email', 'createdAt', 'updatedAt'];
        const allowedSortOrders = ['ASC', 'DESC'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const validSortOrder = allowedSortOrders.includes(sortOrder) ? sortOrder : 'DESC';
        return { sortBy: validSortBy, sortOrder: validSortOrder };
    }
};
exports.ClienteController = ClienteController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new client' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Client created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "createClient", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List clients with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (min: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: `Items per page (max: ${100})` }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search by name, email or CPF' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sort field: nome, email, createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort order: ASC, DESC' }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "getClients", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Find client by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "getClientById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update client' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDto]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "updateClient", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete client' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClienteController.prototype, "deleteClient", null);
exports.ClienteController = ClienteController = __decorate([
    (0, swagger_1.ApiTags)('clientes'),
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [cliente_service_1.ClienteService])
], ClienteController);
//# sourceMappingURL=cliente.controller.js.map
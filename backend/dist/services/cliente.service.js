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
exports.ClienteService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const cliente_entity_1 = require("../entities/cliente.entity");
let ClienteService = class ClienteService {
    constructor(clienteModel) {
        this.clienteModel = clienteModel;
    }
    async create(createClienteDto) {
        return await this.clienteModel.create(createClienteDto);
    }
    async findAll(page = 1, limit = 10, search) {
        const offset = (page - 1) * limit;
        const whereCondition = this.buildSearchCondition(search);
        const { count, rows } = await this.clienteModel.findAndCountAll({
            where: whereCondition,
            limit: Number(limit),
            offset: Number(offset),
            order: [['createdAt', 'DESC']]
        });
        return {
            data: rows,
            total: count,
            page: Number(page),
            totalPages: Math.ceil(count / Number(limit)),
        };
    }
    async findOne(id) {
        const cliente = await this.clienteModel.findByPk(id);
        if (!cliente) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return cliente;
    }
    async update(id, updateClienteDto) {
        const cliente = await this.findOne(id);
        return await cliente.update(updateClienteDto);
    }
    async remove(id) {
        const cliente = await this.findOne(id);
        await cliente.destroy();
    }
    buildSearchCondition(search) {
        if (!search || !search.trim()) {
            return {};
        }
        const searchTerm = search.trim();
        return {
            [sequelize_2.Op.or]: [
                { nome: { [sequelize_2.Op.like]: `%${searchTerm}%` } },
                { email: { [sequelize_2.Op.like]: `%${searchTerm}%` } },
                { cpf: { [sequelize_2.Op.like]: `%${searchTerm}%` } }
            ]
        };
    }
};
exports.ClienteService = ClienteService;
exports.ClienteService = ClienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [Object])
], ClienteService);
//# sourceMappingURL=cliente.service.js.map
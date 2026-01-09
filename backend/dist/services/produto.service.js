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
exports.ProdutoService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const produto_entity_1 = require("../entities/produto.entity");
const cliente_entity_1 = require("../entities/cliente.entity");
let ProdutoService = class ProdutoService {
    constructor(produtoModel) {
        this.produtoModel = produtoModel;
    }
    async create(createProdutoDto) {
        return await this.produtoModel.create(createProdutoDto);
    }
    async findAll(page = 1, limit = 10, search, minPrice, maxPrice, clienteId, sortBy = 'createdAt', sortOrder = 'DESC') {
        const offset = (page - 1) * limit;
        const whereCondition = this.buildSearchCondition(search, minPrice, maxPrice, clienteId);
        const { count, rows } = await this.produtoModel.findAndCountAll({
            where: whereCondition,
            include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }],
            limit: Number(limit),
            offset: Number(offset),
            order: [[sortBy, sortOrder]]
        });
        return {
            data: rows,
            total: count,
            page: Number(page),
            totalPages: Math.ceil(count / Number(limit)),
        };
    }
    async findOne(id) {
        const produto = await this.produtoModel.findByPk(id, {
            include: [{ model: cliente_entity_1.Cliente, attributes: ['id', 'nome'] }]
        });
        if (!produto) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return produto;
    }
    async update(id, updateProdutoDto) {
        const produto = await this.findOne(id);
        return await produto.update(updateProdutoDto);
    }
    async remove(id) {
        const produto = await this.findOne(id);
        await produto.destroy();
    }
    buildSearchCondition(search, minPrice, maxPrice, clienteId) {
        const conditions = {};
        if (search && search.trim()) {
            const searchTerm = search.trim();
            conditions[sequelize_2.Op.or] = [
                { nome: { [sequelize_2.Op.like]: `%${searchTerm}%` } },
                { descricao: { [sequelize_2.Op.like]: `%${searchTerm}%` } }
            ];
        }
        if (minPrice !== undefined) {
            conditions.preco = { ...conditions.preco, [sequelize_2.Op.gte]: minPrice };
        }
        if (maxPrice !== undefined) {
            conditions.preco = { ...conditions.preco, [sequelize_2.Op.lte]: maxPrice };
        }
        if (clienteId !== undefined) {
            conditions.clienteId = clienteId;
        }
        return conditions;
    }
};
exports.ProdutoService = ProdutoService;
exports.ProdutoService = ProdutoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(produto_entity_1.Produto)),
    __metadata("design:paramtypes", [Object])
], ProdutoService);
//# sourceMappingURL=produto.service.js.map
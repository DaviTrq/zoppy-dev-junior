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
exports.ProdutoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const produto_service_1 = require("../services/produto.service");
const create_produto_dto_1 = require("../dto/create-produto.dto");
const update_produto_dto_1 = require("../dto/update-produto.dto");
let ProdutoController = class ProdutoController {
    constructor(produtoService) {
        this.produtoService = produtoService;
        this.MAX_LIMIT = 100;
        this.DEFAULT_LIMIT = 10;
        this.DEFAULT_PAGE = 1;
    }
    async createProduct(createProdutoDto) {
        return await this.produtoService.create(createProdutoDto);
    }
    async getProducts(page, limit, search, minPrice, maxPrice, clienteId, sortBy, sortOrder) {
        const validatedPage = this.validatePage(page);
        const validatedLimit = this.validateLimit(limit);
        const validatedSearch = this.validateSearch(search);
        const validatedPriceRange = this.validatePriceRange(minPrice, maxPrice);
        const validatedSort = this.validateSort(sortBy, sortOrder);
        return await this.produtoService.findAll(validatedPage, validatedLimit, validatedSearch, validatedPriceRange.minPrice, validatedPriceRange.maxPrice, clienteId, validatedSort.sortBy, validatedSort.sortOrder);
    }
    async getProductById(id) {
        return await this.produtoService.findOne(id);
    }
    async updateProduct(id, updateProdutoDto) {
        return await this.produtoService.update(id, updateProdutoDto);
    }
    async deleteProduct(id) {
        return await this.produtoService.remove(id);
    }
    validatePage(page) {
        if (!page || page < 1)
            return this.DEFAULT_PAGE;
        if (page > 10000) {
            throw new common_1.BadRequestException('Page number too high (max: 10000)');
        }
        return page;
    }
    validateLimit(limit) {
        if (!limit || limit < 1)
            return this.DEFAULT_LIMIT;
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
    validatePriceRange(minPrice, maxPrice) {
        if (minPrice && minPrice < 0) {
            throw new common_1.BadRequestException('Minimum price cannot be negative');
        }
        if (maxPrice && maxPrice < 0) {
            throw new common_1.BadRequestException('Maximum price cannot be negative');
        }
        if (minPrice && maxPrice && minPrice > maxPrice) {
            throw new common_1.BadRequestException('Minimum price cannot be greater than maximum price');
        }
        if (maxPrice && maxPrice > 1000000) {
            throw new common_1.BadRequestException('Maximum price too high (max: 1,000,000)');
        }
        return { minPrice, maxPrice };
    }
    validateSort(sortBy, sortOrder) {
        const allowedSortFields = ['nome', 'preco', 'createdAt', 'updatedAt'];
        const allowedSortOrders = ['ASC', 'DESC'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const validSortOrder = allowedSortOrders.includes(sortOrder) ? sortOrder : 'DESC';
        return { sortBy: validSortBy, sortOrder: validSortOrder };
    }
};
exports.ProdutoController = ProdutoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new product' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_produto_dto_1.CreateProdutoDto]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List products with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (min: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: `Items per page (max: ${100})` }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search by name or description' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, description: 'Minimum price filter' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, description: 'Maximum price filter' }),
    (0, swagger_1.ApiQuery)({ name: 'clienteId', required: false, description: 'Filter by client ID' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sort field: nome, preco, createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort order: ASC, DESC' }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('minPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('maxPrice', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, common_1.Query)('clienteId', new common_1.ParseIntPipe({ optional: true }))),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Find product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_produto_dto_1.UpdateProdutoDto]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "deleteProduct", null);
exports.ProdutoController = ProdutoController = __decorate([
    (0, swagger_1.ApiTags)('produtos'),
    (0, common_1.Controller)('produtos'),
    __metadata("design:paramtypes", [produto_service_1.ProdutoService])
], ProdutoController);
//# sourceMappingURL=produto.controller.js.map
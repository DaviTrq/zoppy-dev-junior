"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cliente_entity_1 = require("./entities/cliente.entity");
const produto_entity_1 = require("./entities/produto.entity");
const cliente_controller_1 = require("./controllers/cliente.controller");
const produto_controller_1 = require("./controllers/produto.controller");
const cliente_service_1 = require("./services/cliente.service");
const produto_service_1 = require("./services/produto.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 3306,
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_DATABASE || 'zoppy_db',
                models: [cliente_entity_1.Cliente, produto_entity_1.Produto],
                autoLoadModels: true,
                synchronize: true,
            }),
            sequelize_1.SequelizeModule.forFeature([cliente_entity_1.Cliente, produto_entity_1.Produto]),
        ],
        controllers: [cliente_controller_1.ClienteController, produto_controller_1.ProdutoController],
        providers: [cliente_service_1.ClienteService, produto_service_1.ProdutoService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
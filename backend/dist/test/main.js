"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.getHttpAdapter().get('/', (req, res) => {
        res.json({
            message: 'Zoppy API está funcionando!',
            endpoints: {
                clientes: '/clientes',
                produtos: '/produtos',
                docs: '/api/docs'
            }
        });
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: ['http://localhost:4200'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Zoppy API')
        .setDescription('API CRUD para gerenciamento de Clientes e Produtos')
        .setVersion('1.0')
        .addTag('clientes', 'Operações relacionadas a clientes')
        .addTag('produtos', 'Operações relacionadas a produtos')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Aplicação rodando na porta ${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map
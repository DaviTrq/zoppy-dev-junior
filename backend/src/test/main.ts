import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Rota raiz
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
  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Zoppy API')
    .setDescription('API CRUD para gerenciamento de Clientes e Produtos')
    .setVersion('1.0')
    .addTag('clientes', 'Operações relacionadas a clientes')
    .addTag('produtos', 'Operações relacionadas a produtos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`Documentação disponível em http://localhost:${port}/api/docs`);
}

bootstrap();
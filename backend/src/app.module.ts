import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cliente } from './entities/cliente.entity';
import { Produto } from './entities/produto.entity';
import { ClienteController } from './controllers/cliente.controller';
import { ProdutoController } from './controllers/produto.controller';
import { ClienteService } from './services/cliente.service';
import { ProdutoService } from './services/produto.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'zoppy',
      models: [Cliente, Produto],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Cliente, Produto]),
  ],
  controllers: [ClienteController, ProdutoController],
  providers: [ClienteService, ProdutoService],
})
export class AppModule {}
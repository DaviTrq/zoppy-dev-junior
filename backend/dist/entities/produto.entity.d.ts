import { Model } from 'sequelize-typescript';
import { Cliente } from './cliente.entity';
export declare class Produto extends Model<Produto> {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    clienteId: number;
    cliente: Cliente;
}

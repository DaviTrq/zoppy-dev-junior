import { Model } from 'sequelize-typescript';
import { Produto } from './produto.entity';
export declare class Cliente extends Model<Cliente> {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    produtos: Produto[];
}

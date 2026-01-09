import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Produto } from './produto.entity';

@Table({
  tableName: 'clientes',
  timestamps: true,
})
export class Cliente extends Model<Cliente> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nome: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  telefone: string;

  @Column({
    type: DataType.STRING(14),
    allowNull: true,
    unique: true,
  })
  cpf: string;

  @HasMany(() => Produto)
  produtos: Produto[];
}
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cliente } from './cliente.entity';

@Table({
  tableName: 'produtos',
  timestamps: true,
})
export class Produto extends Model<Produto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nome: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descricao: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  preco: number;

  @ForeignKey(() => Cliente)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clienteId: number;

  @BelongsTo(() => Cliente)
  cliente: Cliente;
}
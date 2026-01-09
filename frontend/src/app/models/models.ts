export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  createdAt?: Date;
  updatedAt?: Date;
  produtos?: Produto[];
}

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  clienteId: number;
  cliente?: Cliente;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
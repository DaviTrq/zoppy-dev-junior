import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
export declare class ClienteService {
    private clienteModel;
    constructor(clienteModel: typeof Cliente);
    create(createClienteDto: CreateClienteDto): Promise<Cliente>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Cliente[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Cliente>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente>;
    remove(id: number): Promise<void>;
    private buildSearchCondition;
}

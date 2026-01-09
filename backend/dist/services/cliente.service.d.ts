import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
export declare class ClienteService {
    private clienteModel;
    private readonly MAX_SEARCH_RESULTS;
    constructor(clienteModel: typeof Cliente);
    create(createClienteDto: CreateClienteDto): Promise<Cliente>;
    findAll(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{
        data: Cliente[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
        hasMore: boolean;
        filters: {
            search: string;
            sortBy: string;
            sortOrder: "ASC" | "DESC";
        };
    }>;
    findOne(id: number): Promise<Cliente>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente>;
    remove(id: number): Promise<void>;
    private buildSearchCondition;
    findWithAdvancedFilters(filters: {
        page?: number;
        limit?: number;
        nome?: string;
        email?: string;
        createdAfter?: Date;
        createdBefore?: Date;
    }): Promise<{
        data: Cliente[];
        total: number;
        page: number;
        totalPages: number;
        appliedFilters: {
            page?: number;
            limit?: number;
            nome?: string;
            email?: string;
            createdAfter?: Date;
            createdBefore?: Date;
        };
    }>;
}

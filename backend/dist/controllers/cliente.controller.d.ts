import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
export declare class ClienteController {
    private readonly clienteService;
    private readonly MAX_LIMIT;
    private readonly DEFAULT_LIMIT;
    private readonly DEFAULT_PAGE;
    constructor(clienteService: ClienteService);
    createClient(createClienteDto: CreateClienteDto): Promise<import("../entities/cliente.entity").Cliente>;
    getClients(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{
        data: import("../entities/cliente.entity").Cliente[];
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
    getClientById(id: number): Promise<import("../entities/cliente.entity").Cliente>;
    updateClient(id: number, updateClienteDto: UpdateClienteDto): Promise<import("../entities/cliente.entity").Cliente>;
    deleteClient(id: number): Promise<void>;
    private validatePage;
    private validateLimit;
    private validateSearch;
    private validateSort;
}

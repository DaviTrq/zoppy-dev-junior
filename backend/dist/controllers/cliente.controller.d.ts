import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
export declare class ClienteController {
    private readonly clienteService;
    constructor(clienteService: ClienteService);
    createClient(createClienteDto: CreateClienteDto): Promise<import("../entities/cliente.entity").Cliente>;
    getClients(page?: number, limit?: number, search?: string): Promise<{
        data: import("../entities/cliente.entity").Cliente[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getClientById(id: number): Promise<import("../entities/cliente.entity").Cliente>;
    updateClient(id: number, updateClienteDto: UpdateClienteDto): Promise<import("../entities/cliente.entity").Cliente>;
    deleteClient(id: number): Promise<void>;
}

import { Produto } from '../entities/produto.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
export declare class ProdutoService {
    private produtoModel;
    constructor(produtoModel: typeof Produto);
    create(createProdutoDto: CreateProdutoDto): Promise<Produto>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Produto[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Produto>;
    update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto>;
    remove(id: number): Promise<void>;
    private buildSearchCondition;
}

import { ProdutoService } from '../services/produto.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
export declare class ProdutoController {
    private readonly produtoService;
    constructor(produtoService: ProdutoService);
    createProduct(createProdutoDto: CreateProdutoDto): Promise<import("../entities/produto.entity").Produto>;
    getProducts(page?: number, limit?: number, search?: string): Promise<{
        data: import("../entities/produto.entity").Produto[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getProductById(id: number): Promise<import("../entities/produto.entity").Produto>;
    updateProduct(id: number, updateProdutoDto: UpdateProdutoDto): Promise<import("../entities/produto.entity").Produto>;
    deleteProduct(id: number): Promise<void>;
}

import { ProdutoService } from '../services/produto.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
export declare class ProdutoController {
    private readonly produtoService;
    private readonly MAX_LIMIT;
    private readonly DEFAULT_LIMIT;
    private readonly DEFAULT_PAGE;
    constructor(produtoService: ProdutoService);
    createProduct(createProdutoDto: CreateProdutoDto): Promise<import("../entities/produto.entity").Produto>;
    getProducts(page?: string, limit?: string, search?: string): Promise<{
        data: import("../entities/produto.entity").Produto[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getProductById(id: number): Promise<import("../entities/produto.entity").Produto>;
    updateProduct(id: number, updateProdutoDto: UpdateProdutoDto): Promise<import("../entities/produto.entity").Produto>;
    deleteProduct(id: number): Promise<void>;
    private validatePage;
    private validateLimit;
    private validateSearch;
    private validatePriceRange;
    private validateSort;
}

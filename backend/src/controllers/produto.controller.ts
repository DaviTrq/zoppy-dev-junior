import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProdutoService } from '../services/produto.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutoController {
  private readonly MAX_LIMIT = 100;
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_PAGE = 1;

  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async createProduct(@Body(ValidationPipe) createProdutoDto: CreateProdutoDto) {
    return await this.produtoService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'List products with pagination and filters' })
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    
    return await this.produtoService.findAll(
      pageNum,
      limitNum,
      search
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.produtoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProdutoDto: UpdateProdutoDto,
  ) {
    return await this.produtoService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.produtoService.remove(id);
  }

  private validatePage(page?: number): number {
    if (!page || page < 1) return this.DEFAULT_PAGE;
    if (page > 10000) {
      throw new BadRequestException('Page number too high (max: 10000)');
    }
    return page;
  }

  private validateLimit(limit?: number): number {
    if (!limit || limit < 1) return this.DEFAULT_LIMIT;
    if (limit > this.MAX_LIMIT) {
      throw new BadRequestException(`Limit too high (max: ${this.MAX_LIMIT})`);
    }
    return limit;
  }

  private validateSearch(search?: string): string | undefined {
    if (!search) return undefined;
    const trimmed = search.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private validatePriceRange(minPrice?: number, maxPrice?: number) {
    if (minPrice && minPrice < 0) {
      throw new BadRequestException('Minimum price cannot be negative');
    }
    if (maxPrice && maxPrice < 0) {
      throw new BadRequestException('Maximum price cannot be negative');
    }
    if (minPrice && maxPrice && minPrice > maxPrice) {
      throw new BadRequestException('Minimum price cannot be greater than maximum price');
    }
    if (maxPrice && maxPrice > 1000000) {
      throw new BadRequestException('Maximum price too high (max: 1,000,000)');
    }
    return { minPrice, maxPrice };
  }

  private validateSort(sortBy?: string, sortOrder?: string) {
    const allowedSortFields = ['nome', 'preco', 'createdAt', 'updatedAt'];
    const allowedSortOrders = ['ASC', 'DESC'];

    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = allowedSortOrders.includes(sortOrder) ? sortOrder as 'ASC' | 'DESC' : 'DESC';

    return { sortBy: validSortBy, sortOrder: validSortOrder };
  }
}
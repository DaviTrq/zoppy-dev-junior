import { UpdateProdutoDto } from './update-produto.dto';

describe('UpdateProdutoDto', () => {
  it('should be defined', () => {
    const dto = new UpdateProdutoDto();
    expect(dto).toBeDefined();
  });

  it('should have optional properties', () => {
    const dto = new UpdateProdutoDto();
    dto.nome = 'Updated Product';
    dto.preco = 199.99;
    
    expect(dto.nome).toBe('Updated Product');
    expect(dto.preco).toBe(199.99);
  });
});
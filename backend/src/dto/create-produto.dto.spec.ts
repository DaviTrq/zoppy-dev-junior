import { CreateProdutoDto } from './create-produto.dto';

describe('CreateProdutoDto', () => {
  it('should be defined', () => {
    const dto = new CreateProdutoDto();
    expect(dto).toBeDefined();
  });

  it('should have required properties', () => {
    const dto = new CreateProdutoDto();
    dto.nome = 'Test Product';
    dto.preco = 99.99;
    dto.clienteId = 1;
    
    expect(dto.nome).toBe('Test Product');
    expect(dto.preco).toBe(99.99);
    expect(dto.clienteId).toBe(1);
  });
});
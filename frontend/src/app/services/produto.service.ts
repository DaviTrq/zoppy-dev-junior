import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Produto, PaginatedResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly apiUrl = 'http://localhost:3000/produtos';
  private productsCache = new BehaviorSubject<Produto[]>([]);
  public products$ = this.productsCache.asObservable();

  constructor(private http: HttpClient) {}

  getProdutos(page: number = 1, limit: number = 10, search?: string): Observable<PaginatedResponse<Produto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    
    return this.http.get<PaginatedResponse<Produto>>(this.apiUrl, { params })
      .pipe(
        tap(response => this.productsCache.next(response.data))
      );
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  createProduto(produto: Produto): Observable<Produto> {
    const payload = this.sanitizeProductData(produto);
    return this.http.post<Produto>(this.apiUrl, payload)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  updateProduto(id: number, produto: Produto): Observable<Produto> {
    const payload = this.sanitizeProductData(produto);
    return this.http.patch<Produto>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  private sanitizeProductData(produto: Produto) {
    const { id, cliente, ...data } = produto;
    return data;
  }

  private invalidateCache() {
    // Could implement more sophisticated caching here
    this.getProdutos().subscribe();
  }
}
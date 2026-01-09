import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cliente, PaginatedResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly apiUrl = 'http://localhost:3000/clientes';
  private clientsCache = new BehaviorSubject<Cliente[]>([]);
  public clients$ = this.clientsCache.asObservable();

  constructor(private http: HttpClient) {}

  getClientes(page: number = 1, limit: number = 10, search?: string): Observable<PaginatedResponse<Cliente>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    
    return this.http.get<PaginatedResponse<Cliente>>(this.apiUrl, { params })
      .pipe(
        tap(response => this.clientsCache.next(response.data))
      );
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    const payload = this.sanitizeClientData(cliente);
    return this.http.post<Cliente>(this.apiUrl, payload)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    const payload = this.sanitizeClientData(cliente);
    return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  private sanitizeClientData(cliente: Cliente) {
    const { id, ...data } = cliente;
    return data;
  }

  private invalidateCache() {
    // Could implement more sophisticated caching here
    this.getClientes().subscribe();
  }
}
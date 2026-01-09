import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ClienteService } from '../services/cliente.service';
import { Cliente, PaginatedResponse } from '../models/models';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="page-title">Clientes</h1>
            <div class="flex gap-2 mt-2">
              <button routerLink="/clientes" class="btn-secondary text-sm">Clientes</button>
              <button routerLink="/produtos" class="btn-secondary text-sm">Produtos</button>
            </div>
          </div>
          <button (click)="onCreate()" class="btn-primary w-full sm:w-auto">
            Novo Cliente
          </button>
        </div>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Buscar clientes..."
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          class="form-input"
        >
      </div>
      
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="text-secondary">Loading...</div>
      </div>
      
      <!-- Mobile: Cards -->
      <div *ngIf="!isLoading && clientes.length > 0" class="mobile-cards">
        <div *ngFor="let cliente of clientes; let i = index" [class]="i % 2 === 0 ? 'table-row-even mobile-card-item' : 'table-row-odd mobile-card-item'">
          <div class="text-primary font-medium mb-2">{{ cliente.nome }}</div>
          <div class="text-secondary text-sm mb-1">{{ cliente.email }}</div>
          <div class="text-secondary text-sm mb-3">{{ cliente.telefone || '-' }}</div>
          <div class="mobile-card-actions">
            <button (click)="onEdit(cliente.id!)" class="btn-secondary mobile-card-button">
              Editar
            </button>
            <button (click)="onDelete(cliente.id!)" class="btn-danger mobile-card-button">
              Deletar
            </button>
          </div>
        </div>
      </div>
      
      <!-- Desktop: Table -->
      <div *ngIf="!isLoading && clientes.length > 0" class="desktop-table">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="table-header">
                <th class="text-left table-cell">Nome</th>
                <th class="text-left table-cell">E-mail</th>
                <th class="text-left table-cell">Telefone</th>
                <th class="text-right table-cell">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cliente of clientes; let i = index" [class]="i % 2 === 0 ? 'table-row-even' : 'table-row-odd'">
                <td class="table-cell">
                  <div class="text-primary">{{ cliente.nome }}</div>
                </td>
                <td class="table-cell">
                  <div class="text-secondary">{{ cliente.email }}</div>
                </td>
                <td class="table-cell">
                  <div class="text-secondary">{{ cliente.telefone || '-' }}</div>
                </td>
                <td class="table-cell text-right">
                  <div class="table-actions">
                    <button (click)="onEdit(cliente.id!)" class="btn-secondary table-button">
                      Editar
                    </button>
                    <button (click)="onDelete(cliente.id!)" class="btn-danger table-button">
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div *ngIf="!isLoading && clientes.length === 0" class="empty-state">
        Nenhum cliente encontrado
      </div>
      
      <div *ngIf="totalPages > 1" class="pagination-container">
        <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 1" class="pagination-btn pagination-button">
          Anterior
        </button>
        <span class="text-secondary text-center">Página {{ currentPage }} de {{ totalPages }}</span>
        <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage === totalPages" class="pagination-btn pagination-button">
          Próxima
        </button>
      </div>
    </div>
  `
})
export class ClienteListComponent implements OnInit, OnDestroy {
  clientes: Cliente[] = [];
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  isLoading = false;
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadData();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.isLoading = true;
    this.clienteService.getClientes(this.currentPage, 10, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Cliente>) => {
          this.clientes = response.data;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading clientes:', error);
          this.isLoading = false;
        }
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  onDelete(id: number) {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      this.clienteService.deleteCliente(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadData());
    }
  }

  onCreate() {
    this.router.navigate(['/clientes/novo']);
  }

  onEdit(id: number) {
    this.router.navigate(['/clientes', id]);
  }
}
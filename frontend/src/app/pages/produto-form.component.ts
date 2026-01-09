import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { ClienteService } from '../services/cliente.service';
import { Produto, Cliente } from '../models/models';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-nav">
          <button routerLink="/produtos" class="link-back">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>
          <h1 class="page-title">
            {{ isEditMode ? 'Edit Product' : 'New Product' }}
          </h1>
        </div>
      </div>

      <div class="form-container">
        <div class="form-wrapper">
          <form (ngSubmit)="handleSubmit()" class="card card-spacing">
            <div class="form-grid">
              <div>
                <label class="form-label">Name</label>
                <input
                  type="text"
                  [(ngModel)]="formData.nome"
                  name="nome"
                  required
                  class="form-input"
                  placeholder="Enter product name"
                >
              </div>

              <div>
                <label class="form-label">Price</label>
                <input
                  type="number"
                  [(ngModel)]="formData.preco"
                  name="preco"
                  step="0.01"
                  min="0"
                  required
                  class="form-input"
                  placeholder="0.00"
                >
              </div>

              <div>
                <label class="form-label">Client</label>
                <select
                  [(ngModel)]="formData.clienteId"
                  name="clienteId"
                  required
                  class="form-input"
                >
                  <option value="">Select a client</option>
                  <option *ngFor="let cliente of availableClients" [value]="cliente.id">
                    {{ cliente.nome }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label">Description</label>
              <textarea
                [(ngModel)]="formData.descricao"
                name="descricao"
                rows="3"
                class="form-input"
                placeholder="Product description (optional)"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="isSaving" class="btn-primary form-button">
                {{ isSaving ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save') }}
              </button>
              <button type="button" routerLink="/produtos" class="btn-secondary form-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProdutoFormComponent implements OnInit {
  formData: Produto = {
    nome: '',
    descricao: '',
    preco: 0,
    clienteId: 0
  };
  availableClients: Cliente[] = [];
  isEditMode = false;
  isSaving = false;
  private productId?: number;

  constructor(
    private produtoService: ProdutoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadClients();
    
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'novo') {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProductData();
    }
  }

  private loadClients() {
    this.clienteService.getClientes(1, 100).subscribe({
      next: (response) => {
        this.availableClients = response.data;
      },
      error: (err) => {
        console.error('Failed to load clients:', err);
      }
    });
  }

  private loadProductData() {
    if (!this.productId) return;
    
    this.isSaving = true;
    this.produtoService.getProdutoById(this.productId).subscribe({
      next: (produto) => {
        this.formData = {
          id: produto.id,
          nome: produto.nome || '',
          descricao: produto.descricao || '',
          preco: produto.preco || 0,
          clienteId: produto.clienteId || 0
        };
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.isSaving = false;
      }
    });
  }

  handleSubmit() {
    if (!this.formData.nome || !this.formData.preco || !this.formData.clienteId) return;

    this.isSaving = true;

    const request = this.isEditMode
      ? this.produtoService.updateProduto(this.formData.id!, this.formData)
      : this.produtoService.createProduto(this.formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/produtos']);
      },
      error: () => {
        this.isSaving = false;
        alert('Error saving product');
      }
    });
  }
}
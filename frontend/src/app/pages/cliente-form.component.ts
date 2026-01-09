import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/models';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-nav">
          <button routerLink="/clientes" class="link-back">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>
          <h1 class="page-title">
            {{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}
          </h1>
        </div>
      </div>

      <div class="form-container">
        <div class="form-wrapper">
          <form (ngSubmit)="handleSubmit()" class="card card-spacing">
            <div class="form-grid">
              <div>
                <label class="form-label">Nome</label>
                <input
                  type="text"
                  [(ngModel)]="formData.nome"
                  name="nome"
                  required
                  autocomplete="off"
                  class="form-input"
                  placeholder="Digite o nome completo"
                >
              </div>

              <div>
                <label class="form-label">E-mail</label>
                <input
                  type="email"
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  autocomplete="off"
                  class="form-input"
                  placeholder="email@exemplo.com"
                >
              </div>

              <div>
                <label class="form-label">Telefone</label>
                <input
                  type="tel"
                  [(ngModel)]="formData.telefone"
                  name="telefone"
                  (input)="formatPhone($event)"
                  maxlength="15"
                  autocomplete="off"
                  class="form-input"
                  placeholder="(11) 99999-9999"
                >
              </div>
            </div>

            <div>
              <label class="form-label">CPF</label>
              <input
                type="text"
                [(ngModel)]="formData.cpf"
                name="cpf"
                (input)="formatCPF($event)"
                maxlength="14"
                autocomplete="off"
                class="form-input"
                placeholder="000.000.000-00"
              >
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="isSaving" class="btn-primary form-button">
                {{ isSaving ? (isEditMode ? 'Atualizando...' : 'Salvando...') : (isEditMode ? 'Atualizar' : 'Salvar') }}
              </button>
              <button type="button" routerLink="/clientes" class="btn-secondary form-button">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ClienteFormComponent implements OnInit {
  formData: Cliente = {
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  };
  isEditMode = false;
  isSaving = false;
  private clientId?: number;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'novo') {
      this.isEditMode = true;
      this.clientId = +id;
      this.loadClientData();
    }
  }

  private loadClientData() {
    if (!this.clientId) return;
    
    this.isSaving = true;
    this.clienteService.getClienteById(this.clientId).subscribe({
      next: (cliente) => {
        this.formData = {
          id: cliente.id,
          nome: cliente.nome || '',
          email: cliente.email || '',
          telefone: cliente.telefone || '',
          cpf: cliente.cpf || ''
        };
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Failed to load client:', err);
        this.isSaving = false;
      }
    });
  }

  handleSubmit() {
    if (!this.formData.nome || !this.formData.email) return;

    this.isSaving = true;
    
    const request = this.isEditMode 
      ? this.clienteService.updateCliente(this.formData.id!, this.formData)
      : this.clienteService.createCliente(this.formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.isSaving = false;
        alert('Error saving client');
      }
    });
  }

  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    }
    
    this.formData.telefone = value;
    event.target.value = value;
  }

  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    this.formData.cpf = value;
    event.target.value = value;
  }
}
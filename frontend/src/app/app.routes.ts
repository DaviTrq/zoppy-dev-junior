import { Routes } from '@angular/router';
import { ClienteListComponent } from './pages/cliente-list.component';
import { ClienteFormComponent } from './pages/cliente-form.component';
import { ProdutoListComponent } from './pages/produto-list.component';
import { ProdutoFormComponent } from './pages/produto-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/:id', component: ClienteFormComponent },
  { path: 'produtos', component: ProdutoListComponent },
  { path: 'produtos/novo', component: ProdutoFormComponent },
  { path: 'produtos/:id', component: ProdutoFormComponent },
  { path: '**', redirectTo: '/clientes' }
];
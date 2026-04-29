import { Routes } from '@angular/router';
import { authGuard, ownerGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './shared/components/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/pages/home.page').then(m => m.HomePage)
      },
      // Autenticação
      {
        path: 'auth',
        children: [
          {
            path: 'acesso-negado',
            loadComponent: () => import('./features/auth/pages/acesso-negado.page').then(m => m.AcessoNegadoPage)
          },
          {
            path: 'login',
            loadComponent: () => import('./features/auth/pages/login.page').then(m => m.LoginPage)
          },
          {
            path: 'signup',
            loadComponent: () => import('./features/auth/pages/signup.page').then(m => m.SignupPage)
          }
        ]
      },
      // Agenda Pública (Cliente)
      {
        path: 'agenda',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'giovani-barbearia',
            pathMatch: 'full'
          },
          {
            path: ':salonSlug',
            loadComponent: () => import('./features/agenda-publica/pages/agenda.page').then(m => m.AgendaPage)
          }
        ]
      },
      // Painel do Salão (Admin)
      {
        path: 'painel',
        canActivate: [ownerGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/painel-salao/pages/dashboard.page').then(m => m.DashboardPage)
          },
          {
            path: 'agendamentos',
            loadComponent: () => import('./features/painel-salao/pages/agenda.page').then(m => m.PainelAgendaPage)
          },
          {
            path: 'relatorios',
            loadComponent: () => import('./features/painel-salao/pages/relatorios.page').then(m => m.RelatoriosPage)
          },
          {
            path: 'configuracoes',
            loadComponent: () => import('./features/painel-salao/pages/configuracoes.page').then(m => m.ConfiguracoesPage)
          }
        ]
      },
      // Perfil do Cliente
      {
        path: 'cliente',
        canActivate: [authGuard],
        children: [
          {
            path: 'solicitar-salao',
            loadComponent: () => import('./features/cliente/pages/solicitar-salao.page').then(m => m.SolicitarSalaoPage)
          },
          {
            path: 'meus-agendamentos',
            loadComponent: () => import('./features/cliente/pages/meus-agendamentos.page').then(m => m.MeusAgendamentosPage)
          }
        ]
      }
    ]
  },
  // Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];

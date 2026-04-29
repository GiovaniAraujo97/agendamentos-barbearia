import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelService } from '../services/painel.service';
import { Appointment } from '../../../shared/models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="stats">
        <div class="stat-card">
          <h3>Agendamentos Hoje</h3>
          <p class="number">{{ agendamentosHoje }}</p>
        </div>
        <div class="stat-card">
          <h3>Receita Hoje</h3>
          <p class="number">R$ {{ receitaHoje }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .stat-card {
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .number {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }
  `]
})
export class DashboardPage implements OnInit {
  agendamentosHoje = 0;
  receitaHoje = 0;

  constructor(private painelService: PainelService) {}

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      // TODO: Implementar carregamento de dados
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    }
  }
}

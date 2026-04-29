import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelService } from '../services/painel.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AgendaService } from '../../agenda-publica/services/agenda.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="hero">
        <div>
          <p class="eyebrow">Painel do salão</p>
          <h1>{{ salonName }}</h1>
          <p class="subtitle" *ngIf="salonLocation">{{ salonLocation }}</p>
        </div>
        <div class="hero-note" *ngIf="!loading && hasSalon">
          <span>Hoje</span>
          <strong>{{ todayLabel }}</strong>
        </div>
      </div>

      <p class="feedback" *ngIf="loading">Carregando dashboard...</p>
      <p class="feedback error" *ngIf="errorMessage">{{ errorMessage }}</p>

      <div class="success-modal-backdrop" *ngIf="showSuccessModal">
        <div class="success-modal" role="alertdialog" aria-live="polite">
          <h3>Pronto</h3>
          <p>{{ successModalMessage }}</p>
        </div>
      </div>

      <section class="empty-state" *ngIf="!loading && !errorMessage && !hasSalon">
        <h2>Seu acesso ainda não foi vinculado a um salão</h2>
        <p>
          Quando sua solicitação for aprovada, o salão será associado ao seu usuário e os dados do painel aparecerão aqui.
        </p>
      </section>

      <div class="stats" *ngIf="!loading && hasSalon">
        <div class="stat-card">
          <h3>Agendamentos Hoje</h3>
          <p class="number">{{ agendamentosHoje }}</p>
          <span>Total confirmado para o dia</span>
        </div>
        <div class="stat-card">
          <h3>Receita Hoje</h3>
          <p class="number">R$ {{ receitaHoje | number: '1.2-2' }}</p>
          <span>Soma dos serviços confirmados</span>
        </div>
        <div class="stat-card">
          <h3>Serviços Ativos</h3>
          <p class="number">{{ totalServicos }}</p>
          <span>Itens disponíveis para agendamento</span>
        </div>
        <div class="stat-card">
          <h3>Profissionais</h3>
          <p class="number">{{ totalProfissionais }}</p>
          <span>Equipe vinculada ao salão</span>
        </div>
      </div>

      <section class="appointments-section" *ngIf="!loading && hasSalon">
        <div class="section-head">
          <div>
            <p class="eyebrow">Agenda dos próximos dias</p>
            <h2>Próximos atendimentos</h2>
          </div>
        </div>

        <div class="appointments-list" *ngIf="agendamentos.length > 0; else noAppointments">
          <article class="appointment-card" *ngFor="let appointment of agendamentos">
            <span class="status-badge card-status" [class.cancelled]="appointment.status === 'cancelled'" [class.completed]="appointment.status === 'completed'" [class.pending]="appointment.status === 'confirmed'">
              {{ getStatusLabel(appointment.status) }}
            </span>

            <div class="appointment-time">
              <strong>{{ appointment.startTime | date: 'dd/MM HH:mm' }} - {{ appointment.endTime | date: 'HH:mm' }}</strong>
            </div>

            <div class="appointment-body">
              <h3>{{ appointment.clientName }}</h3>
              <p>{{ appointment.serviceName || 'Serviço não identificado' }}</p>
              <small>{{ appointment.clientPhone }} · {{ appointment.clientEmail }}</small>
              <strong class="appointment-price">R$ {{ appointment.servicePrice | number: '1.2-2' }}</strong>
            </div>

            <div class="appointment-meta">
              <button
                type="button"
                class="cancel-btn"
                *ngIf="appointment.status === 'confirmed'"
                [disabled]="cancellingId === appointment.id"
                (click)="cancelByOwner(appointment.id)"
              >
                {{ cancellingId === appointment.id ? 'Cancelando...' : 'Cancelar' }}
              </button>
            </div>
          </article>
        </div>

        <ng-template #noAppointments>
          <div class="empty-appointments">
            <h3>Nenhum agendamento futuro encontrado</h3>
            <p>Quando novos clientes reservarem horários, eles aparecerão aqui em ordem cronológica.</p>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1120px;
      margin: 0 auto;
      display: grid;
      gap: 1.5rem;
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .eyebrow {
      display: inline-block;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #8ecdf1;
      margin-bottom: 0.65rem;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    .subtitle {
      color: #9cb5c9;
      margin-bottom: 0;
    }

    .hero-note,
    .feedback,
    .empty-state,
    .empty-appointments,
    .appointment-card,
    .stat-card {
      background: #0b1422;
      border: 1px solid #22344a;
      border-radius: 18px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
    }

    .hero-note {
      min-width: 180px;
      padding: 1rem 1.1rem;
    }

    .hero-note span {
      display: block;
      color: #9cb5c9;
      margin-bottom: 0.35rem;
    }

    .feedback,
    .empty-state,
    .empty-appointments {
      padding: 1.1rem 1.2rem;
    }

    .feedback.error {
      color: #ffc4d3;
      border-color: #a34b63;
      background: #3a1520;
    }

    .success-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 999;
      display: grid;
      place-items: center;
      background: rgba(3, 9, 16, 0.58);
      backdrop-filter: blur(3px);
      animation: fadeIn 140ms ease-out;
    }

    .success-modal {
      width: min(92vw, 360px);
      background: #0f1f33;
      border: 1px solid #2f8f64;
      color: #d8ffef;
      border-radius: 14px;
      padding: 1rem 1.1rem;
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.32);
      text-align: center;
    }

    .success-modal h3 {
      margin: 0 0 0.45rem;
    }

    .success-modal p {
      margin: 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .stat-card h3 {
      color: #dff4ff;
      margin-bottom: 0.55rem;
    }

    .number {
      font-size: 2rem;
      font-weight: bold;
      color: #7fd6ff;
      margin-bottom: 0.35rem;
    }

    .stat-card span {
      color: #9cb5c9;
      font-size: 0.92rem;
    }

    .appointments-section {
      display: grid;
      gap: 1rem;
    }

    .appointments-list {
      display: grid;
      gap: 0.85rem;
    }

    .appointment-card {
      position: relative;
      display: grid;
      grid-template-columns: 84px minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.1rem;
    }

    .appointment-time strong,
    .appointment-time span,
    .appointment-body small,
    .appointment-body p {
      display: block;
    }

    .appointment-time strong {
      font-size: 1.2rem;
      color: #dff4ff;
    }

    .appointment-time span,
    .appointment-body p,
    .appointment-body small {
      color: #9cb5c9;
    }

    .appointment-body h3 {
      margin-bottom: 0.35rem;
      color: #f5fbff;
    }

    .appointment-body p {
      margin-bottom: 0.25rem;
    }

    .appointment-price {
      display: block;
      margin-top: 0.55rem;
      color: #dff4ff;
      font-size: 1rem;
    }

    .appointment-meta {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;
    }

    .cancel-btn {
      margin-top: 0.7rem;
      border: 1px solid #7f1d1d;
      background: linear-gradient(135deg, #3f0d16 0%, #7a1f2f 100%);
      color: #ffe2ea;
      padding: 0.48rem 0.82rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .cancel-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a1220 0%, #962c40 100%);
    }

    .cancel-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .status-badge {
      display: inline-flex;
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
      border: 1px solid rgba(95, 199, 255, 0.25);
      background: rgba(95, 199, 255, 0.12);
      color: #bfefff;
    }

    .card-status {
      position: absolute;
      top: 0.9rem;
      right: 1.1rem;
    }

    .status-badge.completed {
      border-color: rgba(34, 197, 94, 0.25);
      background: rgba(34, 197, 94, 0.12);
      color: #bbf7d0;
    }

    .status-badge.cancelled {
      border-color: rgba(239, 68, 68, 0.25);
      background: rgba(239, 68, 68, 0.12);
      color: #fecaca;
    }

    .status-badge.pending {
      border-color: rgba(34, 197, 94, 0.25);
      background: rgba(34, 197, 94, 0.12);
      color: #bbf7d0;
    }

    @media (max-width: 980px) {
      .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .hero,
      .appointment-card {
        grid-template-columns: 1fr;
      }

      .hero {
        flex-direction: column;
      }

      .hero-note {
        text-align: left;
      }

      .appointment-meta {
        text-align: right;
        justify-self: end;
      }
    }

    @media (max-width: 560px) {
      .stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardPage implements OnInit {
  loading = true;
  errorMessage = '';
  showSuccessModal = false;
  successModalMessage = '';
  cancellingId: string | null = null;
  hasSalon = false;
  salonName = 'Dashboard';
  salonLocation = '';
  todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });
  agendamentosHoje = 0;
  receitaHoje = 0;
  totalServicos = 0;
  totalProfissionais = 0;
  agendamentos: Array<any> = [];

  constructor(
    private painelService: PainelService,
    private supabaseService: SupabaseService,
    private agendaService: AgendaService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const authUser = await this.supabaseService.getCurrentUser();

      if (!authUser?.id) {
        this.errorMessage = 'Sessão inválida. Faça login novamente.';
        return;
      }

      const snapshot = await this.painelService.getDashboardSnapshot(authUser.id);

      if (!snapshot) {
        this.hasSalon = false;
        return;
      }

      this.hasSalon = true;
      this.salonName = snapshot.salon.name;
      this.salonLocation = [snapshot.salon.city, snapshot.salon.state].filter(Boolean).join(' · ');
      this.agendamentosHoje = snapshot.appointmentsTodayCount;
      this.receitaHoje = snapshot.revenueToday;
      this.totalServicos = snapshot.servicesCount;
      this.totalProfissionais = snapshot.professionalsCount;
      this.agendamentos = snapshot.upcomingAppointments;
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      this.errorMessage = 'Nao foi possivel carregar os dados do painel.';
    } finally {
      this.loading = false;
    }
  }

  getStatusLabel(status: string): string {
    if (status === 'completed') return 'Concluido';
    if (status === 'cancelled') return 'Cancelado';
    if (status === 'no-show') return 'Nao compareceu';
    return 'Confirmado';
  }

  async cancelByOwner(appointmentId: string): Promise<void> {
    this.cancellingId = appointmentId;
    this.errorMessage = '';

    try {
      await this.agendaService.atualizarStatusAgendamento(appointmentId, 'cancelled');
      this.openSuccessModal('Agendamento cancelado com sucesso.');
      await this.loadData();
    } catch (error: any) {
      this.errorMessage = error?.message || 'Não foi possível cancelar o agendamento.';
    } finally {
      this.cancellingId = null;
    }
  }

  private openSuccessModal(message: string): void {
    this.successModalMessage = message;
    this.showSuccessModal = true;

    setTimeout(() => {
      this.showSuccessModal = false;
      this.successModalMessage = '';
    }, 1600);
  }
}

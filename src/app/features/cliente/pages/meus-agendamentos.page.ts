import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../agenda-publica/services/agenda.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Appointment } from '../../../shared/models/appointment.model';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meus-agendamentos">
      <h1>Meus Agendamentos</h1>

      <p class="subtitle" *ngIf="loading">Carregando seus agendamentos...</p>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

      <div class="success-modal-backdrop" *ngIf="showSuccessModal">
        <div class="success-modal" role="alertdialog" aria-live="polite">
          <h3>Pronto</h3>
          <p>{{ successModalMessage }}</p>
        </div>
      </div>

      <div class="empty" *ngIf="!loading && !errorMessage && appointments.length === 0">
        Você ainda não possui agendamentos.
      </div>

      <div class="list" *ngIf="!loading && appointments.length > 0">
        <article class="card" *ngFor="let item of appointments">
          <div class="line">
            <span>Data e horário</span>
            <strong>{{ item.startTime | date: 'dd/MM/yyyy HH:mm' }}</strong>
          </div>
          <div class="line status-line">
            <span>Status</span>
            <strong class="status" [class.cancelled]="item.status === 'cancelled'">{{ getStatusLabel(item.status) }}</strong>
          </div>
          <div class="line">
            <span>Contato</span>
            <strong>{{ item.clientEmail }}</strong>
          </div>
          <div class="line">
            <span>Telefone</span>
            <strong>{{ item.clientPhone }}</strong>
          </div>
          <div class="line" *ngIf="item.notes">
            <span>Observações</span>
            <strong>{{ item.notes }}</strong>
          </div>

          <div class="actions" *ngIf="item.status === 'confirmed'">
            <button
              type="button"
              class="cancel-btn"
              [disabled]="cancellingId === item.id"
              (click)="cancelAppointment(item.id)"
            >
              {{ cancellingId === item.id ? 'Cancelando...' : 'Cancelar agendamento' }}
            </button>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .meus-agendamentos {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 1rem;
    }

    .subtitle {
      color: #9cb5c9;
      margin-bottom: 1.5rem;
    }

    .error {
      background: #3a1520;
      border: 1px solid #a34b63;
      color: #ffc4d3;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
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

    .empty {
      background: #0b1422;
      border: 1px solid #22344a;
      border-radius: 8px;
      padding: 1rem;
      color: #b7d1e4;
    }

    .list {
      display: grid;
      gap: 1rem;
    }

    .card {
      background: #0b1422;
      border: 1px solid #22344a;
      border-radius: 10px;
      padding: 1rem;
    }

    .line {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .line span {
      color: #9cb5c9;
    }

    .status-line {
      justify-content: flex-start;
      gap: 0.55rem;
    }

    .status {
      text-transform: capitalize;
      color: #9adfff;
      text-align: left;
    }

    .status.cancelled {
      color: #ffb4b4;
    }

    .actions {
      margin-top: 0.75rem;
      display: flex;
      justify-content: flex-end;
    }

    .cancel-btn {
      border: 1px solid #7f1d1d;
      background: linear-gradient(135deg, #3f0d16 0%, #7a1f2f 100%);
      color: #ffe2ea;
      padding: 0.55rem 0.9rem;
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

    @media (max-width: 480px) {
      .card {
        padding: 0.9rem;
      }

      .line {
        flex-direction: column;
        gap: 0.2rem;
      }
    }
  `]
})
export class MeusAgendamentosPage implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  errorMessage = '';
  showSuccessModal = false;
  successModalMessage = '';
  cancellingId: string | null = null;
  private currentUserId: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private agendaService: AgendaService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.supabaseService.getCurrentUser();
      if (!user) {
        this.errorMessage = 'Sessão expirada. Faça login novamente.';
        return;
      }

      this.currentUserId = user.id;
      await this.loadAppointments();
    } catch (error: any) {
      this.errorMessage = error?.message || 'Erro ao carregar seus agendamentos.';
    } finally {
      this.loading = false;
    }
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    this.cancellingId = appointmentId;
    this.errorMessage = '';

    try {
      await this.agendaService.atualizarStatusAgendamento(appointmentId, 'cancelled');
      await this.loadAppointments();
      this.openSuccessModal('Agendamento cancelado com sucesso.');
    } catch (error: any) {
      this.errorMessage = error?.message || 'Não foi possível cancelar o agendamento.';
    } finally {
      this.cancellingId = null;
    }
  }

  getStatusLabel(status: Appointment['status']): string {
    if (status === 'completed') return 'Concluído';
    if (status === 'cancelled') return 'Cancelado';
    if (status === 'no-show') return 'Não compareceu';
    return 'Confirmado';
  }

  private async loadAppointments(): Promise<void> {
    if (!this.currentUserId) return;
    this.appointments = await this.agendaService.getMeusAgendamentos(this.currentUserId);
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

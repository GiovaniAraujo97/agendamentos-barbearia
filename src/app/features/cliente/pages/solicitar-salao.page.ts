import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ClienteService } from '../services/cliente.service';
import { SalonRequest } from '../../../shared/models/salon-request.model';
import { ErrorTranslator } from '../../../core/utils/error-translator';
import { formatPhoneBr } from '../../../core/utils/phone-formatter';

@Component({
  selector: 'app-solicitar-salao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="salon-request-page">
      <div class="page-hero">
        <p class="eyebrow">Painel do salão</p>
        <h1>Solicitar cadastro do seu salão</h1>
        <p class="lead">
          Envie os dados iniciais do seu negócio. Depois da aprovação, sua conta passa a ter acesso ao painel de gestão.
        </p>
      </div>

      <p *ngIf="loading" class="feedback">Carregando seus dados...</p>
      <p *ngIf="errorMessage" class="feedback error">{{ errorMessage }}</p>
      <p *ngIf="successMessage" class="feedback success">{{ successMessage }}</p>

      <section class="status-card" *ngIf="currentRequest && !loading">
        <div class="status-head">
          <div>
            <span class="eyebrow">Solicitação enviada</span>
            <h2>{{ currentRequest.salonName }}</h2>
          </div>
          <span class="status-badge" [class.pending]="currentRequest.status === 'pending'" [class.approved]="currentRequest.status === 'approved'" [class.rejected]="currentRequest.status === 'rejected'">
            {{ getStatusLabel(currentRequest.status) }}
          </span>
        </div>

        <div class="status-grid">
          <div>
            <span>Responsável</span>
            <strong>{{ currentRequest.ownerName }}</strong>
          </div>
          <div>
            <span>Telefone</span>
            <strong>{{ currentRequest.ownerPhone }}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{{ currentRequest.ownerEmail }}</strong>
          </div>
          <div>
            <span>Slug solicitado</span>
            <strong>{{ currentRequest.slugRequested }}</strong>
          </div>
          <div *ngIf="currentRequest.city">
            <span>Cidade</span>
            <strong>{{ currentRequest.city }}</strong>
          </div>
          <div>
            <span>Enviado em</span>
            <strong>{{ currentRequest.createdAt | date: 'dd/MM/yyyy HH:mm' }}</strong>
          </div>
        </div>

        <p class="status-note" *ngIf="currentRequest.status === 'pending'">
          Seu pedido está em análise. Quando aprovado, seu perfil será liberado como dono do salão.
        </p>
        <p class="status-note" *ngIf="currentRequest.status === 'approved'">
          Solicitação aprovada. Faça login novamente para acessar o painel do salão.
        </p>
        <p class="status-note" *ngIf="currentRequest.status === 'rejected'">
          Solicitação recusada no momento. Ajuste os dados com o suporte para reenviar.
        </p>
      </section>

      <form class="request-form" *ngIf="!currentRequest && !loading" (ngSubmit)="submitRequest()">
        <div class="form-grid">
          <div class="form-group">
            <label for="ownerName">Seu nome</label>
            <input id="ownerName" type="text" [(ngModel)]="form.ownerName" name="ownerName" required />
          </div>

          <div class="form-group">
            <label for="ownerPhone">Telefone</label>
            <input
              id="ownerPhone"
              type="tel"
              [(ngModel)]="form.ownerPhone"
              name="ownerPhone"
              maxlength="13"
              placeholder="(11)9876-5432"
              (input)="onOwnerPhoneInput()"
              required
            />
          </div>

          <div class="form-group full">
            <label for="ownerEmail">Email</label>
            <input id="ownerEmail" type="email" [(ngModel)]="form.ownerEmail" name="ownerEmail" required />
          </div>

          <div class="form-group full">
            <label for="salonName">Nome do salão</label>
            <input id="salonName" type="text" [(ngModel)]="form.salonName" name="salonName" required />
          </div>

          <div class="form-group">
            <label for="slugRequested">Slug desejado</label>
            <input id="slugRequested" type="text" [(ngModel)]="form.slugRequested" name="slugRequested" placeholder="meu-salao" required />
          </div>

          <div class="form-group">
            <label for="city">Cidade</label>
            <input id="city" type="text" [(ngModel)]="form.city" name="city" />
          </div>

          <div class="form-group full">
            <label for="notes">Observações</label>
            <textarea id="notes" rows="4" [(ngModel)]="form.notes" name="notes" placeholder="Conte um pouco sobre o salão, horário de funcionamento ou qualquer detalhe importante."></textarea>
          </div>
        </div>

        <button type="submit" class="submit-btn" [disabled]="submitting">
          {{ submitting ? 'Enviando solicitação...' : 'Enviar solicitação' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .salon-request-page {
      max-width: 920px;
      margin: 0 auto;
      display: grid;
      gap: 1.5rem;
    }

    .page-hero {
      padding: 1rem 0 0.5rem;
    }

    .eyebrow {
      display: inline-block;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #8ecdf1;
      margin-bottom: 0.65rem;
    }

    h1, h2 {
      margin-bottom: 0.75rem;
    }

    .lead {
      color: #9cb5c9;
      max-width: 720px;
    }

    .feedback {
      padding: 0.9rem 1rem;
      border-radius: 12px;
      background: #101d30;
      border: 1px solid #22344a;
      color: #dff4ff;
      margin: 0;
    }

    .feedback.error {
      background: #3a1520;
      border-color: #a34b63;
      color: #ffc4d3;
    }

    .feedback.success {
      background: #123225;
      border-color: #2f8f64;
      color: #d8ffef;
    }

    .status-card,
    .request-form {
      background: #0b1422;
      border: 1px solid #22344a;
      border-radius: 18px;
      padding: 1.5rem;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
    }

    .status-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .status-badge {
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: capitalize;
      white-space: nowrap;
    }

    .status-badge.pending {
      background: rgba(250, 204, 21, 0.12);
      color: #fde68a;
      border: 1px solid rgba(250, 204, 21, 0.25);
    }

    .status-badge.approved {
      background: rgba(34, 197, 94, 0.12);
      color: #bbf7d0;
      border: 1px solid rgba(34, 197, 94, 0.25);
    }

    .status-badge.rejected {
      background: rgba(239, 68, 68, 0.12);
      color: #fecaca;
      border: 1px solid rgba(239, 68, 68, 0.25);
    }

    .status-grid,
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .status-grid div,
    .form-group {
      min-width: 0;
    }

    .status-grid span {
      display: block;
      font-size: 0.84rem;
      color: #9cb5c9;
      margin-bottom: 0.35rem;
    }

    .status-grid strong {
      display: block;
      word-break: break-word;
    }

    .status-note {
      margin: 1rem 0 0;
      color: #b6d7ea;
    }

    .full {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      margin-bottom: 0.45rem;
      color: #cfe8f7;
      font-weight: 600;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    .submit-btn {
      margin-top: 1.25rem;
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 14px;
      font-weight: 700;
      color: #05111e;
      background: linear-gradient(135deg, #8fdcff 0%, #5ec7ff 100%);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .status-grid,
      .form-grid {
        grid-template-columns: 1fr;
      }

      .status-head {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .status-card,
      .request-form {
        padding: 1rem;
      }
    }
  `]
})
export class SolicitarSalaoPage implements OnInit {
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  currentRequest: SalonRequest | null = null;
  currentUserId: string | null = null;

  form = {
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    salonName: '',
    slugRequested: '',
    city: '',
    notes: ''
  };

  constructor(
    private supabaseService: SupabaseService,
    private clienteService: ClienteService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.supabaseService.getCurrentUser();
      if (!user) {
        this.errorMessage = 'Faça login para solicitar o cadastro do seu salão.';
        return;
      }

      this.currentUserId = user.id;
      this.form.ownerEmail = user.email || '';
      this.form.ownerName = user.user_metadata?.['name'] || '';
      this.form.ownerPhone = formatPhoneBr(user.user_metadata?.['phone'] || '');

      const { data } = await this.supabaseService.query('users', { id: user.id });
      if (data && data.length > 0) {
        this.form.ownerName = data[0].name || this.form.ownerName;
        this.form.ownerEmail = data[0].email || this.form.ownerEmail;
        this.form.ownerPhone = formatPhoneBr(data[0].phone || this.form.ownerPhone);
      }

      this.currentRequest = await this.clienteService.getSalonRequestByUser(user.id);
    } catch (error: any) {
      this.errorMessage = ErrorTranslator.translate(error);
    } finally {
      this.loading = false;
    }
  }

  async submitRequest(): Promise<void> {
    if (!this.currentUserId) {
      this.errorMessage = 'Sessão inválida. Faça login novamente.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.ownerPhone = formatPhoneBr(this.form.ownerPhone);

    try {
      this.currentRequest = await this.clienteService.createSalonRequest(this.currentUserId, {
        ownerName: this.form.ownerName.trim(),
        ownerEmail: this.form.ownerEmail.trim(),
        ownerPhone: this.form.ownerPhone.trim(),
        salonName: this.form.salonName.trim(),
        slugRequested: this.normalizeSlug(this.form.slugRequested),
        city: this.form.city.trim() || undefined,
        notes: this.form.notes.trim() || undefined
      });

      this.successMessage = 'Solicitação enviada com sucesso. Seu acesso ao painel será liberado após aprovação.';
    } catch (error: any) {
      this.errorMessage = ErrorTranslator.translate(error);
    } finally {
      this.submitting = false;
    }
  }

  getStatusLabel(status: SalonRequest['status']): string {
    if (status === 'approved') return 'Aprovada';
    if (status === 'rejected') return 'Recusada';
    return 'Em análise';
  }

  onOwnerPhoneInput(): void {
    this.form.ownerPhone = formatPhoneBr(this.form.ownerPhone);
  }

  private normalizeSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getFriendlyErrorMessage(error: any, action: string): string {
    const message = String(error?.message || '').toLowerCase();

    if (message.includes('could not find the table') || message.includes('schema cache')) {
      return 'A tabela de solicitacoes ainda nao foi criada no Supabase. Rode o script supabase-salon-requests.sql no SQL Editor e tente novamente.';
    }

    if (message.includes('relation') && message.includes('salon_requests')) {
      return 'A estrutura de solicitacoes do salao ainda nao existe no banco. Rode o script supabase-salon-requests.sql no Supabase.';
    }

    return error?.message || `Erro ao ${action}.`;
  } // método mantido para compatibilidade, mas ErrorTranslator é preferível
}

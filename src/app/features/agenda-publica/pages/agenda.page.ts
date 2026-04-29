import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CalendarComponent } from '../../../shared/components/calendar.component';
import { TimeSlotsComponent } from '../../../shared/components/time-slots.component';
import { AgendaService } from '../services/agenda.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ErrorTranslator } from '../../../core/utils/error-translator';
import { formatPhoneBr } from '../../../core/utils/phone-formatter';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent, TimeSlotsComponent],
  template: `
    <div class="agenda-container">
      <div class="header-section">
        <h1>{{ salonName }}</h1>
        <p class="subtitle">Agende seu horário</p>
      </div>

      <div class="agenda-content">
        <!-- Serviços -->
        <div class="services-section">
          <h2>Selecione o Serviço</h2>
          <div class="services-grid">
            <div
              *ngFor="let service of services"
              [class.selected]="selectedService?.id === service.id"
              (click)="selectService(service)"
              class="service-card"
            >
              <h3>{{ service.name }}</h3>
              <p class="duration">⏱ {{ service.duration }} min</p>
              <p class="price">R$ {{ service.price | number: '1.2-2' }}</p>
            </div>
          </div>
        </div>

        <!-- Calendário e Horários -->
        <div class="scheduling-section" *ngIf="selectedService">
          <div class="calendar-wrapper">
            <app-calendar (dateSelected)="onDateSelected($event)"></app-calendar>
          </div>

          <div class="time-wrapper" *ngIf="selectedDate">
            <app-time-slots
              [selectedTime]="selectedTime"
              [selectedDate]="selectedDate"
              [blockedTimes]="blockedTimes"
              (timeSelected)="onTimeSelected($event)"
            ></app-time-slots>
          </div>
        </div>

        <!-- Formulário de Dados -->
        <div class="form-section" *ngIf="selectedDate && selectedTime">
          <h2>Seus Dados</h2>
          <form (ngSubmit)="submitAppointment()">
            <div class="form-group">
              <label for="name">Nome Completo:</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="appointmentData.clientName"
                name="clientName"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="appointmentData.clientEmail"
                name="clientEmail"
                required
              />
            </div>

            <div class="form-group">
              <label for="phone">Telefone:</label>
              <input
                type="tel"
                id="phone"
                [(ngModel)]="appointmentData.clientPhone"
                name="clientPhone"
                maxlength="13"
                placeholder="(11)9876-5432"
                (input)="onClientPhoneInput()"
                required
              />
            </div>

            <div class="summary">
              <h3>Resumo do Agendamento</h3>
              <div class="summary-item">
                <span>Serviço:</span>
                <strong>{{ selectedService?.name }}</strong>
              </div>
              <div class="summary-item">
                <span>Data:</span>
                <strong>{{ selectedDate | date: 'dd/MM/yyyy' }}</strong>
              </div>
              <div class="summary-item">
                <span>Horário:</span>
                <strong>{{ selectedTime }}</strong>
              </div>
              <div class="summary-item total">
                <span>Valor:</span>
                <strong>R$ {{ selectedService?.price | number: '1.2-2' }}</strong>
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading">
              {{ loading ? 'Agendando...' : 'Confirmar Agendamento' }}
            </button>

            <div *ngIf="successMessage" class="message success">
              {{ successMessage }}
            </div>
            <div *ngIf="errorMessage" class="message error">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .agenda-container {
      max-width: 1000px;
      margin: 0 auto;
      min-width: 0;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-section h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #9cb5c9;
    }

    .agenda-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .services-section {
      background: #0b1422;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.3);
      border: 1px solid #22344a;
    }

    .services-section h2 {
      margin-bottom: 1.5rem;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .service-card {
      border: 2px solid #22344a;
      background: #101d30;
      padding: 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .service-card:hover {
      border-color: #5ec7ff;
      box-shadow: 0 4px 12px rgba(94, 199, 255, 0.24);
      transform: translateY(-2px);
    }

    .service-card.selected {
      background: linear-gradient(135deg, #112844 0%, #5ec7ff 100%);
      color: #061220;
      border-color: transparent;
    }

    .service-card h3 {
      margin-bottom: 0.5rem;
    }

    .duration, .price {
      font-size: 0.9rem;
      margin: 0.25rem 0;
    }

    .service-card.selected .duration,
    .service-card.selected .price {
      color: rgba(6, 18, 32, 0.85);
    }

    .price {
      font-weight: bold;
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }

    .scheduling-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .form-section {
      background: #0b1422;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.3);
      border: 1px solid #22344a;
      grid-column: 1 / -1;
    }

    .form-section h2 {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #22344a;
      border-radius: 4px;
      background: #101d30;
      color: #eaf6ff;
      font-family: inherit;
      font-size: 1rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #5ec7ff;
      box-shadow: 0 0 0 3px rgba(94, 199, 255, 0.2);
    }

    .summary {
      background: #101d30;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
      border-left: 4px solid #5ec7ff;
    }

    .summary h3 {
      margin-bottom: 1rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.5rem 0;
      font-size: 0.95rem;
      gap: 1rem;
    }

    .summary-item.total {
      border-top: 2px solid #22344a;
      padding-top: 0.75rem;
      margin-top: 0.75rem;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #112844 0%, #5ec7ff 100%);
      color: #04101f;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 1rem;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(94, 199, 255, 0.35);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .message {
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      text-align: center;
    }

    .message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .scheduling-section {
        grid-template-columns: 1fr;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .header-section h1 {
        font-size: 1.8rem;
      }

      .services-section,
      .form-section {
        padding: 1.25rem;
      }

      .header-section {
        margin-bottom: 2rem;
      }
    }

    @media (max-width: 480px) {
      .header-section h1 {
        font-size: 1.55rem;
      }

      .subtitle {
        font-size: 0.95rem;
      }

      .services-section,
      .form-section {
        padding: 1rem;
      }

      .service-card {
        padding: 1rem;
      }

      .summary {
        padding: 1rem;
      }

      .summary-item,
      .summary-item.total {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn-submit {
        padding: 0.9rem;
      }
    }
  `]
})
export class AgendaPage implements OnInit {
  salonName = 'Salão de Beleza';
  services: Service[] = [];
  salonId = '';
  professionalId: string | null = null;
  currentUserId: string | null = null;

  selectedService: Service | null = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  blockedTimes: string[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  appointmentData = {
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  };

  constructor(
    private route: ActivatedRoute,
    private agendaService: AgendaService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    const authUser = await this.supabaseService.getCurrentUser();
    this.currentUserId = authUser?.id || null;

    if (authUser) {
      this.appointmentData.clientEmail = authUser.email || '';
      this.appointmentData.clientName = authUser.user_metadata?.['name'] || '';
      this.appointmentData.clientPhone = formatPhoneBr(authUser.user_metadata?.['phone'] || '');

      try {
        const { data } = await this.supabaseService.query('users', { id: authUser.id });
        if (data && data.length > 0) {
          this.appointmentData.clientName = data[0].name || this.appointmentData.clientName;
          this.appointmentData.clientEmail = data[0].email || this.appointmentData.clientEmail;
          this.appointmentData.clientPhone = formatPhoneBr(data[0].phone || this.appointmentData.clientPhone);
        }
      } catch {
        // Mantem dados vindos do auth metadata se o perfil nao tiver phone.
      }
    }

    this.route.params.subscribe(async params => {
      const salonSlug = params['salonSlug'];
      await this.loadSalonData(salonSlug);
    });
  }

  private async loadSalonData(salonSlug: string): Promise<void> {
    this.errorMessage = '';

    try {
      const salon = await this.agendaService.getSalonBySlug(salonSlug);

      if (!salon) {
        this.errorMessage = 'Salão não encontrado.';
        return;
      }

      this.salonId = salon.id;
      this.salonName = salon.name;
      this.services = await this.agendaService.getServicesPublic(this.salonId);
      this.professionalId = await this.agendaService.getDefaultProfessionalId(this.salonId);

      if (this.services.length === 0) {
        this.errorMessage = 'Nenhum serviço disponível para este salão.';
      }

      if (!this.professionalId) {
        this.errorMessage = 'Nenhum profissional ativo disponível para agendamento.';
      }
    } catch (error) {
      this.errorMessage = 'Não foi possível carregar os dados do salão.';
    }
  }

  selectService(service: Service) {
    this.selectedService = service;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  async onDateSelected(date: Date) {
    this.selectedDate = date;
    this.selectedTime = null;
    this.blockedTimes = [];

    if (!this.salonId || !this.professionalId) {
      return;
    }

    this.blockedTimes = await this.agendaService.getBlockedTimes(
      this.salonId,
      this.professionalId,
      this.toIsoDate(date)
    );
  }

  onTimeSelected(time: string) {
    this.selectedTime = time;
  }

  onClientPhoneInput(): void {
    this.appointmentData.clientPhone = formatPhoneBr(this.appointmentData.clientPhone);
  }

  async submitAppointment() {
    if (!this.validateForm()) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      if (!this.salonId || !this.selectedDate || !this.selectedTime || !this.selectedService || !this.professionalId || !this.currentUserId) {
        this.errorMessage = 'Dados do agendamento inválidos. Atualize a página e tente novamente.';
        return;
      }

      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      const startDate = new Date(this.selectedDate);
      startDate.setHours(hours, minutes, 0, 0);

      if (startDate <= new Date()) {
        this.errorMessage = 'Selecione um horário futuro para agendar.';
        return;
      }

      const endDate = new Date(startDate.getTime() + this.selectedService.duration * 60000);

      await this.agendaService.criarAgendamento(this.salonId, {
        clientId: this.currentUserId,
        clientName: this.appointmentData.clientName,
        clientEmail: this.appointmentData.clientEmail,
        clientPhone: this.appointmentData.clientPhone,
        serviceId: this.selectedService.id,
        professionalId: this.professionalId,
        startTime: this.toLocalDateTime(startDate),
        endTime: this.toLocalDateTime(endDate)
      });

      this.successMessage = 'Agendamento realizado com sucesso! Você receberá uma confirmação por email.';
      setTimeout(() => {
        this.router.navigate(['/cliente/meus-agendamentos']);
      }, 900);
    } catch (error: any) {
      this.errorMessage = ErrorTranslator.translate(error);
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
    return (
      this.appointmentData.clientName.trim() !== '' &&
      this.appointmentData.clientEmail.includes('@') &&
      this.appointmentData.clientPhone.trim() !== '' &&
      this.salonId !== '' &&
      this.currentUserId !== null &&
      this.professionalId !== null &&
      this.selectedService !== null &&
      this.selectedDate !== null &&
      this.selectedTime !== null
    );
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}


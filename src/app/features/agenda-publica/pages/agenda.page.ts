import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from '../../../shared/components/calendar.component';
import { TimeSlotsComponent } from '../../../shared/components/time-slots.component';

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
                required
              />
            </div>

            <div class="form-group">
              <label for="notes">Observações (opcional):</label>
              <textarea
                id="notes"
                [(ngModel)]="appointmentData.notes"
                name="notes"
                rows="4"
              ></textarea>
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
      padding: 0.5rem 0;
      font-size: 0.95rem;
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
    }
  `]
})
export class AgendaPage implements OnInit {
  salonName = 'Salão de Beleza';
  services: Service[] = [
    { id: '1', name: 'Corte Feminino', duration: 60, price: 80 },
    { id: '2', name: 'Corte Masculino', duration: 30, price: 50 },
    { id: '3', name: 'Manicure', duration: 45, price: 40 },
    { id: '4', name: 'Pedicure', duration: 60, price: 50 },
    { id: '5', name: 'Escova', duration: 90, price: 120 },
    { id: '6', name: 'Coloração', duration: 120, price: 200 }
  ];

  selectedService: Service | null = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  appointmentData = {
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // TODO: Buscar dados do salão pelo slug
      this.salonName = params['salonSlug']?.replace('-', ' ') || 'Salão';
    });
  }

  selectService(service: Service) {
    this.selectedService = service;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.selectedTime = null;
  }

  onTimeSelected(time: string) {
    this.selectedTime = time;
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
      // TODO: Integrar com AgendaService e Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.successMessage = 'Agendamento realizado com sucesso! Você receberá uma confirmação por email.';
      
      // Limpar formulário
      setTimeout(() => {
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.appointmentData = {
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          notes: ''
        };
      }, 2000);
    } catch (error) {
      this.errorMessage = 'Erro ao agendar. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
    return (
      this.appointmentData.clientName.trim() !== '' &&
      this.appointmentData.clientEmail.includes('@') &&
      this.appointmentData.clientPhone.trim() !== '' &&
      this.selectedService !== null &&
      this.selectedDate !== null &&
      this.selectedTime !== null
    );
  }
}


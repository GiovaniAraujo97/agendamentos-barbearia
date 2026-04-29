import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Appointment, CreateAppointmentDTO } from '../../../shared/models/appointment.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private appointments$ = new BehaviorSubject<Appointment[]>([]);

  constructor(private supabaseService: SupabaseService) {}

  // Agenda Pública - Listar agendamentos do salão
  async getAgendamentosPorSalao(salonId: string): Promise<Appointment[]> {
    const { data, error } = await this.supabaseService.query('appointments', { salonId });
    if (error) throw error;
    return data || [];
  }

  // Agenda Pública - Criar agendamento (cliente)
  async criarAgendamento(salonId: string, payload: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = {
      ...payload,
      salonId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService.insert('appointments', appointment);
    if (error) throw error;
    return data?.[0];
  }

  // Painel - Listar agendamentos do dia
  async getAgendamentosDodia(salonId: string, data: string): Promise<Appointment[]> {
    const { data: appointments, error } = await this.supabaseService.query('appointments', {
      salonId
    });

    if (error) throw error;

    // Filtrar por data (data é ISO string)
    return appointments?.filter((apt: Appointment) => apt.startTime.startsWith(data)) || [];
  }

  // Painel - Atualizar status de agendamento
  async atualizarStatusAgendamento(appointmentId: string, status: string): Promise<Appointment> {
    const { data, error } = await this.supabaseService.update('appointments', appointmentId, {
      status,
      updatedAt: new Date().toISOString()
    });

    if (error) throw error;
    return data?.[0];
  }

  // Painel - Remover agendamento
  async removerAgendamento(appointmentId: string): Promise<void> {
    const { error } = await this.supabaseService.delete('appointments', appointmentId);
    if (error) throw error;
  }

  // Cliente - Meus agendamentos
  async getMeusAgendamentos(clientId: string): Promise<Appointment[]> {
    const { data, error } = await this.supabaseService.query('appointments', { clientId });
    if (error) throw error;
    return data || [];
  }

  getAppointments$(): Observable<Appointment[]> {
    return this.appointments$.asObservable();
  }
}

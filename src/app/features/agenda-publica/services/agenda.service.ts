import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Appointment, CreateAppointmentDTO } from '../../../shared/models/appointment.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ErrorTranslator } from '../../../core/utils/error-translator';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private appointments$ = new BehaviorSubject<Appointment[]>([]);

  constructor(private supabaseService: SupabaseService) {}

  async getSalonBySlug(slug: string): Promise<{ id: string; name: string; slug: string } | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('salons')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async getServicesPublic(salonId: string): Promise<Array<{ id: string; name: string; duration: number; price: number }>> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .select('id, name, duration, price')
      .eq('salon_id', salonId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getDefaultProfessionalId(salonId: string): Promise<string | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .select('id')
      .eq('salon_id', salonId)
      .eq('active', true)
      .limit(1)
      .single();

    if (error) {
      return null;
    }

    return data?.id || null;
  }

  // Agenda Pública - Listar agendamentos do salão
  async getAgendamentosPorSalao(salonId: string): Promise<Appointment[]> {
    const { data, error } = await this.supabaseService.query('appointments', { salonId });
    if (error) throw error;
    return data || [];
  }

  async getBlockedTimes(salonId: string, professionalId: string, date: string): Promise<string[]> {
    const dayStart = `${date}T00:00:00`;
    const dayEnd = `${date}T23:59:59`;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('start_time')
      .eq('salon_id', salonId)
      .eq('professional_id', professionalId)
      .neq('status', 'cancelled')
      .gte('start_time', dayStart)
      .lte('start_time', dayEnd);

    if (error) {
      throw error;
    }

    return (data || []).map((row: any) => this.extractHourMinute(row.start_time)).filter(Boolean);
  }

  // Agenda Pública - Criar agendamento (cliente)
  async criarAgendamento(salonId: string, payload: CreateAppointmentDTO): Promise<Appointment> {
    const authUser = await this.supabaseService.getCurrentUser();
    if (!authUser) {
      throw new Error('Usuário não autenticado. Faça login para agendar.');
    }

    const { data: clientProfile, error: clientProfileError } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .limit(1)
      .maybeSingle();

    if (clientProfileError) {
      throw clientProfileError;
    }

    if (!clientProfile) {
      throw new Error('Perfil do cliente não encontrado.');
    }

    const { data: existingConflict, error: conflictError } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('id')
      .eq('salon_id', salonId)
      .eq('professional_id', payload.professionalId)
      .eq('start_time', payload.startTime)
      .neq('status', 'cancelled')
      .limit(1)
      .maybeSingle();

    if (conflictError) {
      throw conflictError;
    }

    if (existingConflict) {
      throw new Error('Este horário já foi reservado por outro cliente. Escolha outro horário.');
    }

    const appointment = {
      salon_id: salonId,
      client_id: authUser.id,
      client_name: payload.clientName,
      client_email: payload.clientEmail,
      client_phone: payload.clientPhone,
      service_id: payload.serviceId,
      professional_id: payload.professionalId,
      start_time: payload.startTime,
      end_time: payload.endTime,
      status: 'confirmed'
    };

    const { error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .insert(appointment)
      ;

    if (error) {
      throw new Error(ErrorTranslator.translate(error));
    }

    return {
      id: '',
      salonId,
      clientId: authUser.id,
      clientName: payload.clientName,
      clientEmail: payload.clientEmail,
      clientPhone: payload.clientPhone,
      serviceId: payload.serviceId,
      professionalId: payload.professionalId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: 'confirmed',
      notes: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
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
  async atualizarStatusAgendamento(appointmentId: string, status: Appointment['status']): Promise<Appointment> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select('*')
      .single();

    if (error) {
      throw new Error(ErrorTranslator.translate(error));
    }

    return {
      id: data.id,
      salonId: data.salon_id,
      clientId: data.client_id,
      clientName: data.client_name,
      clientEmail: data.client_email,
      clientPhone: data.client_phone,
      serviceId: data.service_id,
      professionalId: data.professional_id,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // Painel - Remover agendamento
  async removerAgendamento(appointmentId: string): Promise<void> {
    const { error } = await this.supabaseService.delete('appointments', appointmentId);
    if (error) throw error;
  }

  // Cliente - Meus agendamentos
  async getMeusAgendamentos(clientId: string): Promise<Appointment[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('start_time', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      salonId: row.salon_id,
      clientId: row.client_id,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      serviceId: row.service_id,
      professionalId: row.professional_id,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  getAppointments$(): Observable<Appointment[]> {
    return this.appointments$.asObservable();
  }

  private extractHourMinute(dateTime: string): string {
    const value = String(dateTime || '');
    const match = value.match(/(?:T|\s)(\d{2}:\d{2})/);

    if (match?.[1]) {
      return match[1];
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const hours = String(parsed.getHours()).padStart(2, '0');
      const minutes = String(parsed.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    return '';
  }
}

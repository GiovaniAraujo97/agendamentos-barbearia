import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Salon, Service, Professional } from '../../../shared/models/salon.model';
import { Appointment } from '../../../shared/models/appointment.model';

export interface DashboardSnapshot {
  salon: Salon;
  servicesCount: number;
  professionalsCount: number;
  appointmentsToday: Appointment[];
  upcomingAppointments: Appointment[];
  appointmentsTodayCount: number;
  revenueToday: number;
}

@Injectable({
  providedIn: 'root'
})
export class PainelService {
  constructor(private supabaseService: SupabaseService) {}

  async getOwnedSalonByUser(userId: string): Promise<Salon | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('salons')
      .select('*')
      .eq('owner_id', userId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapSalon(data) : null;
  }

  async getDashboardSnapshot(userId: string): Promise<DashboardSnapshot | null> {
    const salon = await this.getOwnedSalonByUser(userId);
    if (!salon) {
      return null;
    }

    const [services, professionals, appointmentsToday, upcomingAppointments] = await Promise.all([
      this.getServices(salon.id),
      this.getProfessionals(salon.id),
      this.getAppointmentsToday(salon.id),
      this.getUpcomingAppointments(salon.id)
    ]);

    const revenueToday = appointmentsToday
      .filter(appointment => appointment.status === 'confirmed' || appointment.status === 'completed')
      .reduce((total, appointment: any) => total + (appointment.servicePrice || 0), 0);

    return {
      salon,
      servicesCount: services.length,
      professionalsCount: professionals.length,
      appointmentsToday,
      upcomingAppointments,
      appointmentsTodayCount: appointmentsToday.length,
      revenueToday
    };
  }

  // Obter informações do salão
  async getSalonInfo(salonId: string): Promise<Salon> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('salons')
      .select('*')
      .eq('id', salonId)
      .single();

    if (error) throw error;
    return this.mapSalon(data);
  }

  // Atualizar informações do salão
  async updateSalon(salonId: string, salonData: Partial<Salon>): Promise<Salon> {
    const payload = {
      name: salonData.name,
      email: salonData.email,
      phone: salonData.phone,
      slug: salonData.slug,
      address: salonData.address,
      city: salonData.city,
      state: salonData.state,
      zip_code: salonData.zipCode,
      logo: salonData.logo,
      color: salonData.color,
      owner_id: salonData.ownerId,
      operating_hours: salonData.operatingHours,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('salons')
      .update(payload)
      .eq('id', salonId)
      .select()
      .single();

    if (error) throw error;
    return this.mapSalon(data);
  }

  // Serviços
  async getServices(salonId: string): Promise<Service[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .select('*')
      .eq('salon_id', salonId)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(row => this.mapService(row));
  }

  async createService(salonId: string, service: Omit<Service, 'id' | 'salonId' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const newService = {
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      salon_id: salonId,
      category: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .insert(newService)
      .select()
      .single();

    if (error) throw error;
    return this.mapService(data);
  }

  async updateService(serviceId: string, serviceData: Partial<Service>): Promise<Service> {
    const payload = {
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .update(payload)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return this.mapService(data);
  }

  async deleteService(serviceId: string): Promise<void> {
    const { error } = await this.supabaseService.delete('services', serviceId);
    if (error) throw error;
  }

  // Profissionais
  async getProfessionals(salonId: string): Promise<Professional[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .select('*')
      .eq('salon_id', salonId)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(row => this.mapProfessional(row));
  }

  async createProfessional(salonId: string, professional: Omit<Professional, 'id' | 'salonId'>): Promise<Professional> {
    const newProfessional = {
      name: professional.name,
      email: professional.email,
      salon_id: salonId,
      specialties: professional.specialties,
      active: professional.active
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .insert(newProfessional)
      .select()
      .single();

    if (error) throw error;
    return this.mapProfessional(data);
  }

  async updateProfessional(professionalId: string, professionalData: Partial<Professional>): Promise<Professional> {
    const payload = {
      name: professionalData.name,
      email: professionalData.email,
      specialties: professionalData.specialties,
      active: professionalData.active
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('professionals')
      .update(payload)
      .eq('id', professionalId)
      .select()
      .single();

    if (error) throw error;
    return this.mapProfessional(data);
  }

  // Relatórios
  async getRelatorioPeriodo(salonId: string, dataInicio: string, dataFim: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('*')
      .eq('salon_id', salonId)
      .gte('start_time', dataInicio)
      .lte('start_time', dataFim)
      .order('start_time', { ascending: true });

    if (error) throw error;

    return (data || []).map(row => this.mapAppointment(row));
  }

  async getAppointmentsToday(salonId: string): Promise<Array<Appointment & { serviceName?: string; servicePrice?: number }>> {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('*, services(name, price)')
      .eq('salon_id', salonId)
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      ...this.mapAppointment(row),
      serviceName: row.services?.name,
      servicePrice: Number(row.services?.price || 0)
    }));
  }

  async getUpcomingAppointments(
    salonId: string,
    daysAhead = 30
  ): Promise<Array<Appointment & { serviceName?: string; servicePrice?: number }>> {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + daysAhead);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('appointments')
      .select('*, services(name, price)')
      .eq('salon_id', salonId)
      .gte('start_time', now.toISOString())
      .lte('start_time', end.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      ...this.mapAppointment(row),
      serviceName: row.services?.name,
      servicePrice: Number(row.services?.price || 0)
    }));
  }

  private mapSalon(row: any): Salon {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      slug: row.slug,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      logo: row.logo,
      color: row.color,
      ownerId: row.owner_id,
      operatingHours: row.operating_hours || {},
      services: [],
      professionals: [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapService(row: any): Service {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      duration: row.duration,
      price: Number(row.price),
      salonId: row.salon_id
    };
  }

  private mapProfessional(row: any): Professional {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      salonId: row.salon_id,
      specialties: row.specialties || [],
      active: row.active
    };
  }

  private mapAppointment(row: any): Appointment {
    return {
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
    };
  }
}

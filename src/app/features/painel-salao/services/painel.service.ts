import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Salon, Service, Professional } from '../../../shared/models/salon.model';

@Injectable({
  providedIn: 'root'
})
export class PainelService {
  constructor(private supabaseService: SupabaseService) {}

  // Obter informações do salão
  async getSalonInfo(salonId: string): Promise<Salon> {
    const { data, error } = await this.supabaseService.query('salons', { id: salonId });
    if (error) throw error;
    return data?.[0];
  }

  // Atualizar informações do salão
  async updateSalon(salonId: string, salonData: Partial<Salon>): Promise<Salon> {
    const { data, error } = await this.supabaseService.update('salons', salonId, salonData);
    if (error) throw error;
    return data?.[0];
  }

  // Serviços
  async getServices(salonId: string): Promise<Service[]> {
    const { data, error } = await this.supabaseService.query('services', { salonId });
    if (error) throw error;
    return data || [];
  }

  async createService(salonId: string, service: Omit<Service, 'id' | 'salonId' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const newService = {
      ...service,
      salonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService.insert('services', newService);
    if (error) throw error;
    return data?.[0];
  }

  async updateService(serviceId: string, serviceData: Partial<Service>): Promise<Service> {
    const { data, error } = await this.supabaseService.update('services', serviceId, {
      ...serviceData,
      updatedAt: new Date().toISOString()
    });
    if (error) throw error;
    return data?.[0];
  }

  async deleteService(serviceId: string): Promise<void> {
    const { error } = await this.supabaseService.delete('services', serviceId);
    if (error) throw error;
  }

  // Profissionais
  async getProfessionals(salonId: string): Promise<Professional[]> {
    const { data, error } = await this.supabaseService.query('professionals', { salonId });
    if (error) throw error;
    return data || [];
  }

  async createProfessional(salonId: string, professional: Omit<Professional, 'id' | 'salonId'>): Promise<Professional> {
    const newProfessional = {
      ...professional,
      salonId
    };

    const { data, error } = await this.supabaseService.insert('professionals', newProfessional);
    if (error) throw error;
    return data?.[0];
  }

  async updateProfessional(professionalId: string, professionalData: Partial<Professional>): Promise<Professional> {
    const { data, error } = await this.supabaseService.update('professionals', professionalId, professionalData);
    if (error) throw error;
    return data?.[0];
  }

  // Relatórios
  async getRelatorioPeriodo(salonId: string, dataInicio: string, dataFim: string) {
    const { data, error } = await this.supabaseService.query('appointments', { salonId });
    if (error) throw error;

    // Filtrar appointments por período
    return data?.filter(apt => 
      apt.startTime >= dataInicio && apt.startTime <= dataFim
    ) || [];
  }
}

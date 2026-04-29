import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { CreateSalonRequestDTO, SalonRequest } from '../../../shared/models/salon-request.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private supabaseService: SupabaseService) {}

  async getSalonRequestByUser(userId: string): Promise<SalonRequest | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('salon_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapSalonRequest(data) : null;
  }

  async createSalonRequest(userId: string, payload: CreateSalonRequestDTO): Promise<SalonRequest> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('salon_requests')
      .insert({
        user_id: userId,
        owner_name: payload.ownerName,
        owner_email: payload.ownerEmail,
        owner_phone: payload.ownerPhone,
        salon_name: payload.salonName,
        slug_requested: payload.slugRequested,
        city: payload.city,
        notes: payload.notes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapSalonRequest(data);
  }

  private mapSalonRequest(row: any): SalonRequest {
    return {
      id: row.id,
      userId: row.user_id,
      ownerName: row.owner_name,
      ownerEmail: row.owner_email,
      ownerPhone: row.owner_phone,
      salonName: row.salon_name,
      slugRequested: row.slug_requested,
      city: row.city,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

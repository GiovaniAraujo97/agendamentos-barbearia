import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Autenticação
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // Operações genéricas
  async query(table: string, filter?: any) {
    let query = this.supabase.from(table).select('*');
    
    if (filter) {
      Object.keys(filter).forEach(key => {
        query = query.eq(key, filter[key]);
      });
    }

    return await query;
  }

  async insert(table: string, data: any) {
    return await this.supabase.from(table).insert([data]).select();
  }

  async update(table: string, id: string, data: any) {
    return await this.supabase.from(table).update(data).eq('id', id).select();
  }

  async delete(table: string, id: string) {
    return await this.supabase.from(table).delete().eq('id', id);
  }
}

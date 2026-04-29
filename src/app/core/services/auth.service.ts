import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, SignUpDTO, SignInDTO, AuthResponse } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private supabaseService: SupabaseService) {
    this.checkCurrentUser();
  }

  private async checkCurrentUser() {
    const user = await this.supabaseService.getCurrentUser();
    if (user) {
      try {
        const profile = await this.ensureUserProfile(
          user.id,
          user.email || '',
          user.user_metadata?.['name'],
          user.user_metadata?.['phone']
        );
        this.currentUser$.next(profile);
        this.isAuthenticated$.next(true);
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        await this.signOut();
      }
    }
  }

  async signUp(payload: SignUpDTO) {
    const { data, error } = await this.supabaseService.signUp(payload.email, payload.password, {
      name: payload.name,
      phone: payload.phone
    });
    
    if (error) throw error;

    if (data.user) {
      const fallbackUser = this.buildFallbackUser(data.user.id, payload.email, payload.name, payload.phone);

      // Tenta salvar perfil em public.users sem bloquear o fluxo de cadastro.
      const { data: profileData, error: profileError } = await this.supabaseService
        .getClient()
        .from('users')
        .upsert({
          id: data.user.id,
          email: payload.email,
          name: payload.name,
          phone: payload.phone,
          role: 'client'
        })
        .select()
        .single();

      if (profileError) {
        this.currentUser$.next(fallbackUser);
      } else {
        this.currentUser$.next(this.mapUserFromDb(profileData));
      }

      this.isAuthenticated$.next(true);
    }

    return data;
  }

  async signIn(payload: SignInDTO) {
    const { data, error } = await this.supabaseService.signIn(payload.email, payload.password);
    
    if (error) throw error;

    if (data.user) {
      try {
        const profile = await this.ensureUserProfile(
          data.user.id,
          data.user.email || payload.email,
          data.user.user_metadata?.['name'],
          data.user.user_metadata?.['phone']
        );
        this.currentUser$.next(profile);
        this.isAuthenticated$.next(true);
      } catch (profileError) {
        // Perfil não existe ou erro ao carregar, fazer logout de auth
        await this.supabaseService.signOut();
        this.currentUser$.next(null);
        this.isAuthenticated$.next(false);
        throw profileError;
      }
    }

    return data;
  }

  async signOut() {
    await this.supabaseService.signOut();
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getUserRole(): string | null {
    return this.currentUser$.value?.role || null;
  }

  private mapUserFromDb(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      phone: row.phone,
      role: row.role,
      salonId: row.salon_id ?? row.salonId,
      createdAt: row.created_at ?? row.createdAt,
      updatedAt: row.updated_at ?? row.updatedAt
    };
  }

  private buildFallbackUser(id: string, email: string, name?: string, phone?: string): User {
    const now = new Date().toISOString();
    return {
      id,
      email,
      name: name || email.split('@')[0] || 'Cliente',
      phone,
      role: 'client',
      createdAt: now,
      updatedAt: now
    };
  }

  private async ensureUserProfile(id: string, email: string, name?: string, phone?: string): Promise<User> {
    const { data: userData } = await this.supabaseService.query('users', { id });
    if (userData && userData.length > 0) {
      const currentProfile = userData[0];
      const nextName = currentProfile.name || name;
      const nextPhone = currentProfile.phone || phone;

      if (nextName !== currentProfile.name || nextPhone !== currentProfile.phone) {
        const { data: updatedProfile, error: updateError } = await this.supabaseService
          .getClient()
          .from('users')
          .update({
            name: nextName,
            phone: nextPhone
          })
          .eq('id', id)
          .select()
          .single();

        if (!updateError && updatedProfile) {
          return this.mapUserFromDb(updatedProfile);
        }
      }

      return this.mapUserFromDb({
        ...currentProfile,
        name: nextName,
        phone: nextPhone
      });
    }

    // Se o usuário não existe no banco, não recria automaticamente
    // Isso evita que usuários deletados fiquem logados
    throw new Error('Perfil do usuário não encontrado. Faça login novamente.');
  }
}

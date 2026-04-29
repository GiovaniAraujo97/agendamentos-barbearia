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
      // Carregar dados adicionais do usuário do banco
      const { data } = await this.supabaseService.query('users', { id: user.id });
      if (data && data.length > 0) {
        this.currentUser$.next(data[0]);
        this.isAuthenticated$.next(true);
      }
    }
  }

  async signUp(payload: SignUpDTO) {
    const { data, error } = await this.supabaseService.signUp(payload.email, payload.password);
    
    if (error) throw error;

    // Criar registro de usuário na tabela users
    if (data.user) {
      const newUser: User = {
        id: data.user.id,
        email: payload.email,
        name: payload.name,
        role: 'client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.supabaseService.insert('users', newUser);
      this.currentUser$.next(newUser);
      this.isAuthenticated$.next(true);
    }

    return data;
  }

  async signIn(payload: SignInDTO) {
    const { data, error } = await this.supabaseService.signIn(payload.email, payload.password);
    
    if (error) throw error;

    if (data.user) {
      const { data: userData } = await this.supabaseService.query('users', { id: data.user.id });
      if (userData && userData.length > 0) {
        this.currentUser$.next(userData[0]);
        this.isAuthenticated$.next(true);
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
}

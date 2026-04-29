import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ErrorTranslator } from '../../../core/utils/error-translator';
import { formatPhoneBr, isFullName } from '../../../core/utils/phone-formatter';
import { AuthLoadingOverlayComponent } from '../../../shared/components/auth-loading-overlay.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthLoadingOverlayComponent],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <app-auth-loading-overlay
          *ngIf="entering"
          [title]="'Preparando seu cadastro'"
          [subtitle]="'Montando seu acesso, perfil e agenda inicial.'"
        />

        <h1>Cadastro</h1>
        <form (ngSubmit)="onSignup()">
          <div class="form-group">
            <label for="name">Nome e Sobrenome:</label>
            <input type="text" id="name" [(ngModel)]="name" name="name" placeholder="Ex.: João Silva" required />
          </div>
          <div class="form-group">
            <label for="phone">Telefone:</label>
            <input
              type="tel"
              id="phone"
              [(ngModel)]="phone"
              name="phone"
              maxlength="13"
              placeholder="(11)9876-5432"
              (input)="onPhoneInput()"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Senha:</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required />
          </div>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
        </form>
        <p *ngIf="error" class="error-message">{{ error }}</p>
        <p class="signin-row">
          <span>Já tem conta?</span>
          <a (click)="goToLogin()">Faça login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: calc(100vh - 220px);
      padding: 0.75rem 1rem;
    }

    .signup-card {
      background: #0b1422;
      padding: 2.2rem;
      border: none;
      border-radius: 14px;
      width: min(100%, 460px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
      display: grid;
      gap: 1rem;
    }

    h1 {
      color: #eaf6ff;
      margin: 0;
      font-size: 1.9rem;
      line-height: 1.1;
    }

    form {
      display: grid;
      gap: 0.95rem;
    }

    .form-group {
      display: grid;
      gap: 0.45rem;
    }

    label {
      color: #cde3f5;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      min-height: 44px;
      padding: 0.72rem 0.82rem;
      border-radius: 8px;
      border: 1px solid #294865;
      background: #08101b;
      color: #eaf6ff;
      font-size: 0.98rem;
    }

    input:focus {
      outline: none;
      border-color: #5ec7ff;
      box-shadow: 0 0 0 3px rgba(94, 199, 255, 0.2);
    }

    button {
      width: 100%;
      margin-top: 0.2rem;
      padding: 0.85rem;
      border: none;
      border-radius: 6px;
      background: linear-gradient(135deg, #112844 0%, #5ec7ff 100%);
      color: #04101f;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #9cb5c9;
    }

    .signin-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.25rem;
    }

    a {
      color: #9adfff;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message {
      margin-top: 0.25rem;
      background: #3a1520;
      border: 1px solid #a34b63;
      color: #ffc4d3;
      padding: 0.75rem;
      border-radius: 6px;
    }

    @media (max-width: 768px) {
      .signup-container {
        min-height: calc(100vh - 180px);
        padding: 0.5rem 0.9rem;
      }

      .signup-card {
        width: 100%;
        max-width: 520px;
        padding: 1.6rem;
      }
    }

    @media (max-width: 480px) {
      .signup-card {
        padding: 1.2rem;
        gap: 0.9rem;
      }

      h1 {
        font-size: 1.65rem;
      }

      .signin-row {
        gap: 0.8rem;
      }
    }
  `]
})
export class SignupPage implements OnInit {
  name = '';
  phone = '';
  email = '';
  password = '';
  loading = false;
  entering = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.redirectIfAuthenticated();
  }

  async onSignup() {
    this.loading = true;
    this.error = '';

    this.name = this.name.trim();
    this.phone = formatPhoneBr(this.phone);

    if (!isFullName(this.name)) {
      this.error = 'Informe nome e sobrenome para concluir o cadastro.';
      this.loading = false;
      return;
    }

    try {
      await this.authService.signUp({
        name: this.name,
        phone: this.phone,
        email: this.email,
        password: this.password
      });

      this.entering = true;
      await this.waitForEntranceAnimation();

      this.router.navigate(['/cliente/meus-agendamentos']);
    } catch (err: any) {
      this.entering = false;
      this.error = ErrorTranslator.translate(err);
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  onPhoneInput(): void {
    this.phone = formatPhoneBr(this.phone);
  }

  private async redirectIfAuthenticated(): Promise<void> {
    const user = await this.supabaseService.getCurrentUser();
    if (!user) {
      return;
    }

    const { data } = await this.supabaseService.query('users', { id: user.id });
    const role = data?.[0]?.role;

    if (role === 'owner' || role === 'professional') {
      this.router.navigate(['/painel/dashboard']);
    } else {
      this.router.navigate(['/cliente/meus-agendamentos']);
    }
  }

  private waitForEntranceAnimation(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 850);
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <h1>Cadastro</h1>
        <form (ngSubmit)="onSignup()">
          <div class="form-group">
            <label for="name">Nome:</label>
            <input type="text" id="name" [(ngModel)]="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Senha:</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required />
          </div>
          <button type="submit">Cadastrar</button>
        </form>
        <p>Já tem conta? <a (click)="goToLogin()">Faça login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .signup-card {
      background: #0b1422;
      padding: 2rem;
      border: 1px solid #22344a;
      border-radius: 8px;
      width: 300px;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
    }

    h1 {
      color: #eaf6ff;
      margin-bottom: 1rem;
    }

    button {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      background: linear-gradient(135deg, #112844 0%, #5ec7ff 100%);
      color: #04101f;
      font-weight: 700;
    }

    p {
      margin-top: 1rem;
      color: #9cb5c9;
    }

    a {
      color: #9adfff;
      cursor: pointer;
    }
  `]
})
export class SignupPage {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSignup() {
    this.loading = true;
    this.error = '';

    try {
      await this.authService.signUp({
        name: this.name,
        email: this.email,
        password: this.password
      });
      this.router.navigate(['/painel/dashboard']);
    } catch (err: any) {
      this.error = err.message || 'Erro ao cadastrar';
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}

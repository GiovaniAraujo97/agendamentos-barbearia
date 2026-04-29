import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-layout">
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>✂️ Agenda Salão</h1>
          </div>
          <nav class="nav">
            <a routerLink="/" class="nav-link">Home</a>
            <a routerLink="/agenda" class="nav-link">Agendar</a>
            <a routerLink="/auth/login" class="nav-link login-btn">Login</a>
          </nav>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>&copy; 2026 Agenda de Salão. Todos os direitos reservados.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .header {
      background: linear-gradient(135deg, #05080f 0%, #17345a 100%);
      color: #eaf6ff;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: #c6ebff;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.3s;
      cursor: pointer;
    }

    .nav-link:hover {
      opacity: 1;
      color: #eaf7ff;
    }

    .login-btn {
      background: rgba(154, 223, 255, 0.16);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: 1px solid #9adfff;
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }

    .footer {
      background: #05080f;
      color: #c6ebff;
      text-align: center;
      padding: 2rem;
      margin-top: 2rem;
      border-top: 1px solid #22344a;
    }

    .footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .nav {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppLayoutComponent {}

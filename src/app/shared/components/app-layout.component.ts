import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <div class="logout-overlay" *ngIf="isSigningOut" aria-live="polite" aria-busy="true">
        <div class="logout-card">
          <div class="spinner" aria-hidden="true"></div>
          <strong>Saindo da sua conta...</strong>
          <span>Fechando sessão com segurança</span>
        </div>
      </div>

      <header class="header">
        <div class="header-content">
          <a routerLink="/" class="brand" aria-label="Ir para a página inicial">
            <div class="brand-mark" aria-hidden="true"></div>
            <div class="brand-copy">
              <strong>Agenda Salão</strong>
              <span>Gestão e agendamento</span>
            </div>
          </a>

          <button
            type="button"
            class="menu-toggle"
            (click)="toggleMenu()"
            [attr.aria-expanded]="isMenuOpen"
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav class="nav" [class.open]="isMenuOpen" aria-label="Navegação principal">
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
              (click)="closeMenu()"
            >
              Home
            </a>
            <a
              routerLink="/agenda/giovani-barbearia"
              routerLinkActive="active"
              class="nav-link"
              (click)="closeMenu()"
            >
              Agendar
            </a>
            <ng-container *ngIf="currentUser$ | async as currentUser; else guestActions">
              <a
                *ngIf="currentUser.role === 'owner' || currentUser.role === 'professional'"
                routerLink="/painel/dashboard"
                routerLinkActive="active"
                class="nav-link"
                (click)="closeMenu()"
              >
                Painel
              </a>
              <a
                [routerLink]="getAccountRoute(currentUser)"
                routerLinkActive="active"
                class="nav-link user-pill"
                (click)="closeMenu()"
              >
                {{ getDisplayName(currentUser.name) }}
              </a>
              <button type="button" class="nav-link logout-btn" [disabled]="isSigningOut" (click)="signOut()">
                {{ isSigningOut ? 'Saindo...' : 'Sair' }}
              </button>
            </ng-container>
            <ng-template #guestActions>
              <a routerLink="/auth/login" class="nav-link login-btn" (click)="closeMenu()">Login</a>
            </ng-template>
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

    .logout-overlay {
      position: fixed;
      inset: 0;
      z-index: 1500;
      display: grid;
      place-items: center;
      background: rgba(3, 9, 16, 0.62);
      backdrop-filter: blur(4px);
      animation: fadeOverlay 180ms ease-out;
    }

    .logout-card {
      width: min(90vw, 330px);
      border-radius: 14px;
      border: 1px solid rgba(154, 223, 255, 0.2);
      background: #0f1f33;
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.32);
      padding: 1rem 1.1rem;
      display: grid;
      justify-items: center;
      gap: 0.45rem;
      text-align: center;
    }

    .spinner {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 3px solid rgba(154, 223, 255, 0.24);
      border-top-color: #9adfff;
      animation: spin 800ms linear infinite;
    }

    .logout-card strong {
      color: #eaf6ff;
      font-size: 1rem;
    }

    .logout-card span {
      color: #9cb5c9;
      font-size: 0.9rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .header {
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0)),
        linear-gradient(135deg, #05080f 0%, #122946 55%, #17345a 100%);
      color: #eaf6ff;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(154, 223, 255, 0.14);
      backdrop-filter: blur(12px);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.9rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      position: relative;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      color: inherit;
      min-width: 0;
    }

    .brand:hover {
      color: inherit;
    }

    .brand-mark {
      width: 86px;
      height: 86px;
      flex: 0 0 86px;
      border-radius: 22px;
      background-color: #ffffff;
      background-image: url('../utils/logo-barbearia.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      border: 1px solid rgba(255, 255, 255, 0.72);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
      overflow: hidden;
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-copy strong {
      font-size: 1.45rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .brand-copy span {
      color: #93aec3;
      font-size: 0.82rem;
      line-height: 1.1;
    }

    .nav {
      display: flex;
      gap: 0.65rem;
      align-items: center;
      flex-wrap: wrap;
      padding: 0.35rem;
      border-radius: 999px;
      background: rgba(7, 18, 33, 0.72);
      border: 1px solid rgba(154, 223, 255, 0.12);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
    }

    .menu-toggle {
      display: none;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      border: 1px solid rgba(154, 223, 255, 0.18);
      background: rgba(7, 18, 33, 0.72);
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
    }

    .menu-toggle span {
      width: 18px;
      height: 2px;
      border-radius: 999px;
      background: #dff4ff;
      display: block;
    }

    .nav-link {
      color: #c6ebff;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.25s ease;
      cursor: pointer;
      border: 1px solid transparent;
      padding: 0.7rem 1rem;
      border-radius: 999px;
      background: transparent;
      font-size: 0.96rem;
    }

    .nav-link:hover {
      color: #eaf7ff;
      background: rgba(154, 223, 255, 0.08);
      border-color: rgba(154, 223, 255, 0.12);
    }

    .nav-link.active {
      color: #07111d;
      background: linear-gradient(135deg, #9adfff 0%, #5ec7ff 100%);
      box-shadow: 0 8px 18px rgba(94, 199, 255, 0.22);
    }

    .login-btn {
      background: rgba(154, 223, 255, 0.16);
      border: 1px solid rgba(154, 223, 255, 0.28);
    }

    .user-pill,
    .logout-btn {
      background: rgba(154, 223, 255, 0.12);
      border: 1px solid rgba(154, 223, 255, 0.32);
    }

    .user-pill {
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      color: #c6ebff;
      font-weight: 500;
      font-size: 0.96rem;
      background-color: rgba(255, 255, 255, 0.04);
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem;
      min-width: 0;
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
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
      }

      .brand {
        min-width: 0;
      }

      .menu-toggle {
        display: inline-flex;
      }

      .nav {
        position: absolute;
        top: calc(100% + 0.75rem);
        right: 1rem;
        left: 1rem;
        display: none;
        grid-template-columns: 1fr;
        padding: 0.75rem;
        border-radius: 20px;
        gap: 0.5rem;
        background: rgba(7, 18, 33, 0.96);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
      }

      .nav.open {
        display: grid;
      }

      .user-pill {
        max-width: 100%;
      }

      .nav-link,
      .logout-btn {
        width: 100%;
        text-align: left;
        justify-content: flex-start;
        border-radius: 14px;
      }

      .main-content {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .brand-mark {
        width: 64px;
        height: 64px;
        flex-basis: 64px;
        border-radius: 18px;
      }

      .brand-copy strong {
        font-size: 1.2rem;
      }

      .brand-copy span {
        font-size: 0.76rem;
      }

      .nav-link,
      .logout-btn {
        padding: 0.8rem 0.55rem;
        border-radius: 14px;
      }

      .login-btn {
        padding: 0.8rem 0.55rem;
      }

      .footer {
        padding: 1.25rem 1rem;
      }
    }
  `]
})
export class AppLayoutComponent {
  currentUser$: Observable<User | null>;
  isMenuOpen = false;
  isSigningOut = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const clickedMenu = !!target.closest('.nav');
    const clickedToggle = !!target.closest('.menu-toggle');

    if (!clickedMenu && !clickedToggle) {
      this.closeMenu();
    }
  }

  getDisplayName(name: string | undefined): string {
    if (!name) {
      return 'Minha Conta';
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).join(' ');
  }

  getAccountRoute(user: User): string {
    return user.role === 'owner' || user.role === 'professional'
      ? '/painel/dashboard'
      : '/cliente/meus-agendamentos';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  async signOut(): Promise<void> {
    if (this.isSigningOut) {
      return;
    }

    this.isSigningOut = true;
    this.closeMenu();

    try {
      await this.wait(350);
      await this.authService.signOut();
      await this.wait(280);
      this.router.navigate(['/auth/login']);
    } finally {
      this.isSigningOut = false;
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

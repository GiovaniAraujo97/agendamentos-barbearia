import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <h1>{{ title }}</h1>
        <nav class="nav-menu">
          <a href="/agenda">Agenda</a>
          <a href="/painel">Painel</a>
          <a href="/cliente/meus-agendamentos">Meus Agendamentos</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #05080f 0%, #17345a 100%);
      color: #eaf6ff;
      padding: 1rem;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .nav-menu {
      display: flex;
      gap: 2rem;
    }
    .nav-menu a {
      color: #bce9ff;
      text-decoration: none;
    }
    .nav-menu a:hover {
      text-decoration: underline;
    }
  `]
})
export class HeaderComponent {
  @Input() title = 'Agenda de Salão';
}

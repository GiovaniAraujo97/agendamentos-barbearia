import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="blocked-page">
      <div class="blocked-card">
        <p class="eyebrow">Acesso restrito</p>
        <h1>Seu perfil ainda nao tem acesso ao painel</h1>
        <p>
          O painel do salao so fica disponivel para contas aprovadas como dono ou profissional. Se voce enviou uma solicitacao, ela ainda pode estar em analise.
        </p>

        <div class="actions">
          <a routerLink="/cliente/solicitar-salao" class="primary-action">Solicitar cadastro do salao</a>
          <a routerLink="/cliente/meus-agendamentos" class="secondary-action">Voltar para meus agendamentos</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .blocked-page {
      min-height: 60vh;
      display: grid;
      place-items: center;
    }

    .blocked-card {
      width: min(680px, 100%);
      padding: 2rem;
      border-radius: 24px;
      background: #0b1422;
      border: 1px solid #22344a;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 0.75rem;
      color: #8ecdf1;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 0.78rem;
    }

    h1 {
      margin: 0 0 0.85rem;
      color: #f5fbff;
    }

    p {
      margin: 0;
      color: #a6c4d8;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-top: 1.5rem;
    }

    .primary-action,
    .secondary-action {
      padding: 0.95rem 1.2rem;
      border-radius: 14px;
      font-weight: 700;
      text-align: center;
    }

    .primary-action {
      background: linear-gradient(135deg, #8fdcff 0%, #5ec7ff 100%);
      color: #05111e;
    }

    .secondary-action {
      border: 1px solid #32516d;
      color: #dff4ff;
      background: rgba(143, 220, 255, 0.06);
    }

    @media (max-width: 560px) {
      .blocked-card {
        padding: 1.25rem;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class AcessoNegadoPage {}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home">
      <section class="hero">
        <div class="hero-content">
          <h1>Sistema de Agendamento para Salões</h1>
          <p>Gerencie seus agendamentos de forma simples e eficiente</p>
          <div class="hero-actions">
            <a routerLink="/agenda/giovani-barbearia" class="btn btn-primary">Agendar Agora</a>
            <a routerLink="/cliente/solicitar-salao" class="btn btn-secondary">Cadastrar meu salão</a>
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-icon">✂️💇‍♀️</div>
        </div>
      </section>

      <section class="features">
        <h2>Por que usar nosso sistema?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Agendamento Online</h3>
            <p>Clientes agendam diretamente no seu link</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Relatórios</h3>
            <p>Acompanhe faturamento e performance</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Gestão de Equipe</h3>
            <p>Controle profissionais e especialidades</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Seguro</h3>
            <p>Seus dados protegidos em nuvem</p>
          </div>
        </div>
      </section>

      <section class="how-it-works">
        <h2>Como funciona?</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Cadastre seu Salão</h3>
            <p>Crie uma conta e configure os dados do seu salão</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Configure Serviços</h3>
            <p>Adicione os serviços que oferece</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Compartilhe o Link</h3>
            <p>Envie o link para seus clientes agendarem</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Gerencie</h3>
            <p>Acompanhe todos os agendamentos no painel</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <h2>Comece Agora!</h2>
        <p>Junte-se a centenas de salões usando nosso sistema</p>
        <a routerLink="/auth/signup" class="btn btn-large">Criar Conta Grátis</a>
      </section>
    </div>
  `,
  styles: [`
    .home {
      width: 100%;
      overflow: hidden;
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      padding: 4rem 0;
    }

    .hero-content,
    .hero-image {
      min-width: 0;
    }

    .hero-content h1 {
      font-size: 2.5rem;
      color: #eaf6ff;
      margin-bottom: 1rem;
      text-wrap: balance;
    }

    .hero-content p {
      font-size: 1.2rem;
      color: #9cb5c9;
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: inline-block;
      text-align: center;
      border: 2px solid transparent;
      min-width: 180px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0f223a 0%, #5ec7ff 100%);
      color: #04101f;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(94, 199, 255, 0.35);
    }

    .btn-secondary {
      background: #09111d;
      color: #bce9ff;
      border: 2px solid #5ec7ff;
    }

    .btn-secondary:hover {
      background: #132943;
      color: #eaf7ff;
    }

    .btn-large {
      padding: 1rem 3rem;
      font-size: 1.1rem;
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hero-icon {
      font-size: 8rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .features {
      padding: 4rem 0;
      background: #0b1422;
      margin: 2rem 0;
      border-radius: 8px;
      padding: 4rem 2rem;
      border: 1px solid #22344a;
    }

    .features h2 {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 3rem;
      color: #eaf6ff;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: #101d30;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 6px 14px rgba(0,0,0,0.28);
      border: 1px solid #22344a;
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: #eaf6ff;
    }

    .feature-card p {
      color: #9cb5c9;
    }

    .how-it-works {
      padding: 4rem 0;
    }

    .how-it-works h2 {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 3rem;
      color: #eaf6ff;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .step {
      text-align: center;
      padding: 2rem;
    }

    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #112844 0%, #7ad6ff 100%);
      color: #04101f;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }

    .step h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: #dff4ff;
    }

    .step p {
      color: #9cb5c9;
    }

    .cta {
      background: linear-gradient(135deg, #071221 0%, #173f69 60%, #5ec7ff 100%);
      color: #eaf6ff;
      padding: 4rem 2rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #22344a;
    }

    .cta h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .cta p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        padding: 2rem 0;
        gap: 2rem;
      }

      .hero-content h1 {
        font-size: 2rem;
        text-align: center;
      }

      .hero-content p {
        text-align: center;
      }

      .hero-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }

      .hero-icon {
        font-size: 5rem;
      }

      .features,
      .how-it-works {
        padding: 2rem;
      }

      .feature-card,
      .step {
        padding: 1.25rem;
      }

      .features h2,
      .how-it-works h2,
      .cta h2 {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .hero {
        padding: 1.25rem 0 2rem;
      }

      .hero-content h1 {
        font-size: 1.75rem;
      }

      .hero-content p,
      .cta p {
        font-size: 1rem;
      }

      .features,
      .cta {
        padding: 1.25rem;
      }

      .hero-icon {
        font-size: 4rem;
      }
    }
  `]
})
export class HomePage {}

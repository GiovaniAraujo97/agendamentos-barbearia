import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-loading-overlay" aria-live="polite" aria-busy="true">
      <div class="loading-shell">
        <div class="badge">Preparando seu acesso</div>

        <div class="loading-visual" aria-hidden="true">
          <div class="barber-pole"></div>
          <div class="scissors">✂</div>
        </div>

        <h2>{{ title() }}</h2>
        <p>{{ subtitle() }}</p>

        <div class="loading-track" aria-hidden="true">
          <span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-loading-overlay {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      background:
        radial-gradient(circle at top, rgba(94, 199, 255, 0.18), transparent 38%),
        rgba(4, 8, 15, 0.88);
      backdrop-filter: blur(10px);
      border-radius: inherit;
      z-index: 3;
      animation: fadeOverlay 180ms ease-out;
    }

    .loading-shell {
      width: min(100%, 320px);
      text-align: center;
    }

    .badge {
      display: inline-flex;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      border: 1px solid rgba(154, 223, 255, 0.22);
      background: rgba(154, 223, 255, 0.08);
      color: #bfefff;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .loading-visual {
      position: relative;
      width: 110px;
      height: 110px;
      margin: 1.2rem auto 1rem;
      display: grid;
      place-items: center;
    }

    .barber-pole {
      width: 52px;
      height: 92px;
      border-radius: 999px;
      border: 1px solid rgba(154, 223, 255, 0.2);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent),
        repeating-linear-gradient(
          -35deg,
          #dff4ff 0 16px,
          #dff4ff 16px 22px,
          #e35353 22px 38px,
          #5ec7ff 38px 54px
        );
      box-shadow:
        inset 0 0 0 8px rgba(5, 17, 30, 0.45),
        0 14px 30px rgba(0, 0, 0, 0.25);
      animation: poleSpin 1.2s linear infinite;
    }

    .scissors {
      position: absolute;
      right: 6px;
      bottom: 10px;
      font-size: 1.6rem;
      color: #dff4ff;
      transform-origin: center;
      animation: scissorsCut 900ms ease-in-out infinite;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.3));
    }

    h2 {
      margin: 0 0 0.45rem;
      color: #f5fbff;
      font-size: 1.35rem;
    }

    p {
      margin: 0;
      color: #a9c8db;
    }

    .loading-track {
      width: 100%;
      height: 6px;
      margin-top: 1.2rem;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(154, 223, 255, 0.09);
      border: 1px solid rgba(154, 223, 255, 0.08);
    }

    .loading-track span {
      display: block;
      width: 42%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #7fd6ff 0%, #dff4ff 100%);
      animation: trackSlide 1.1s ease-in-out infinite;
    }

    @keyframes poleSpin {
      from { background-position: 0 0, 0 0; }
      to { background-position: 0 0, 0 72px; }
    }

    @keyframes scissorsCut {
      0%, 100% { transform: rotate(-10deg) scale(1); }
      50% { transform: rotate(10deg) scale(1.08); }
    }

    @keyframes trackSlide {
      0% { transform: translateX(-110%); }
      100% { transform: translateX(270%); }
    }

    @keyframes fadeOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class AuthLoadingOverlayComponent {
  title = input('Entrando no sistema');
  subtitle = input('Preparando sua agenda e sincronizando os dados do salão.');
}
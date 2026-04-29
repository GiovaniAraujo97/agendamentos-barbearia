import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-painel-agenda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="agenda-painel">
      <h1>Agendamentos</h1>
      <p>Página de agenda do painel</p>
    </div>
  `
})
export class PainelAgendaPage {}

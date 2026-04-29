import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meus-agendamentos">
      <h1>Meus Agendamentos</h1>
      <p>Página de agendamentos do cliente</p>
    </div>
  `
})
export class MeusAgendamentosPage {}

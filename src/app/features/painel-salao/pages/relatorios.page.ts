import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relatorios">
      <h1>Relatórios</h1>
      <p>Página de relatórios do painel</p>
    </div>
  `
})
export class RelatoriosPage {}

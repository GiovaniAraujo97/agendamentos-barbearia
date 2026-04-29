import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="configuracoes">
      <h1>Configurações</h1>
      <p>Página de configurações do painel</p>
    </div>
  `
})
export class ConfiguracoesPage {}

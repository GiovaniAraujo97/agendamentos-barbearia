import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="loading">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .spinner {
      border: 4px solid #1a2b41;
      border-top: 4px solid #7ad6ff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    p {
      margin-top: 1rem;
    }
  `]
})
export class LoadingComponent {
  @Input() isLoading = false;
  @Input() message = 'Carregando...';
}

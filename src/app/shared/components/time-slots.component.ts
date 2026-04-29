import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="time-slots">
      <h3>Selecione o horário</h3>
      <div class="slots-grid">
        <button
          *ngFor="let time of timeSlots"
          [class.selected]="selectedTime === time"
          (click)="selectTimeSlot(time)"
          class="time-slot"
        >
          {{ time }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .time-slots {
      background: #0b1422;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 8px 18px rgba(0,0,0,0.3);
      border: 1px solid #22344a;
    }

    h3 {
      margin-bottom: 1rem;
      color: #eaf6ff;
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 0.75rem;
    }

    .time-slot {
      padding: 0.75rem;
      border: 2px solid #22344a;
      background: #101d30;
      color: #eaf6ff;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .time-slot:hover {
      border-color: #5ec7ff;
      background: #142743;
    }

    .time-slot.selected {
      background: #7ad6ff;
      color: #04101f;
      border-color: #7ad6ff;
    }
  `]
})
export class TimeSlotsComponent {
  @Input() selectedTime: string | null = null;
  @Output() timeSelected = new EventEmitter<string>();
  
  timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  selectTimeSlot(time: string) {
    this.selectedTime = time;
    this.timeSelected.emit(time);
  }
}

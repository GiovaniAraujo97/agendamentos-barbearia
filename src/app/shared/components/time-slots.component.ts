import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="time-slots">
      <h3>Selecione o horário</h3>
      <p class="empty-tip" *ngIf="availableTimeSlots.length === 0">
        Não há horários livres para este dia.
      </p>
      <div class="slots-grid">
        <button
          *ngFor="let time of timeSlots"
          [class.selected]="selectedTime === time"
          [class.inactive]="!isSlotAvailable(time)"
          [disabled]="!isSlotAvailable(time)"
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

    .empty-tip {
      margin: 0 0 1rem;
      color: #9cb5c9;
      font-size: 0.95rem;
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

    .time-slot.inactive,
    .time-slot:disabled {
      background: #0a121e;
      color: #5b7289;
      border-color: #1a2a3d;
      cursor: not-allowed;
      opacity: 0.65;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .time-slots {
        padding: 1rem;
      }

      .slots-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .slots-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .time-slot {
        padding: 0.7rem 0.5rem;
      }
    }
  `]
})
export class TimeSlotsComponent {
  @Input() selectedTime: string | null = null;
  @Input() selectedDate: Date | null = null;
  @Input() blockedTimes: string[] = [];
  @Output() timeSelected = new EventEmitter<string>();
  
  timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  get availableTimeSlots(): string[] {
    const now = new Date();
    const selected = this.selectedDate ? new Date(this.selectedDate) : null;

    if (!selected) {
      return this.timeSlots.filter(time => !this.blockedTimes.includes(time));
    }

    const isToday =
      selected.getFullYear() === now.getFullYear() &&
      selected.getMonth() === now.getMonth() &&
      selected.getDate() === now.getDate();

    return this.timeSlots.filter(time => {
      return this.isSlotAvailable(time, now, selected, isToday);
    });
  }

  isSlotAvailable(
    time: string,
    nowArg?: Date,
    selectedArg?: Date,
    isTodayArg?: boolean
  ): boolean {
    const now = nowArg || new Date();
    const selected = selectedArg || (this.selectedDate ? new Date(this.selectedDate) : null);

    if (this.blockedTimes.includes(time)) {
      return false;
    }

    if (!selected) {
      return true;
    }

    const isToday = typeof isTodayArg === 'boolean'
      ? isTodayArg
      : (
        selected.getFullYear() === now.getFullYear() &&
        selected.getMonth() === now.getMonth() &&
        selected.getDate() === now.getDate()
      );

    if (!isToday) {
      return true;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(selected);
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate > now;
  }

  selectTimeSlot(time: string) {
    this.selectedTime = time;
    this.timeSelected.emit(time);
  }
}

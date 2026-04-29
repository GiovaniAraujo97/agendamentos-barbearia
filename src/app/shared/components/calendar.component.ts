import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar">
      <div class="calendar-header">
        <button (click)="previousMonth()" class="nav-btn" [disabled]="isCurrentMonth()">←</button>
        <h2>{{ monthYear }}</h2>
        <button (click)="nextMonth()" class="nav-btn">→</button>
      </div>

      <div class="weekdays">
        <div *ngFor="let day of weekDays" class="weekday">{{ day }}</div>
      </div>

      <div class="dates">
        <div *ngFor="let day of emptyDays" class="empty"></div>
        <div
          *ngFor="let day of daysInMonth"
          [class.selected]="isSelected(day)"
          [class.today]="isToday(day)"
          [class.available]="isAvailable(day)"
          [class.inactive]="!isAvailable(day)"
          (click)="selectDate(day)"
          class="date"
        >
          {{ day }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar {
      background: #0b1422;
      border-radius: 8px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.3);
      border: 1px solid #22344a;
      padding: 1.5rem;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .calendar-header h2 {
      font-size: 1.3rem;
      min-width: 150px;
      text-align: center;
    }

    .nav-btn {
      background: #173f69;
      color: #eaf6ff;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .nav-btn:hover {
      background: #245b93;
    }

    .nav-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      background: #173f69;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .weekday {
      font-weight: bold;
      text-align: center;
      padding: 0.5rem;
      color: #9cb5c9;
      font-size: 0.9rem;
    }

    .dates {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
    }

    .date, .empty {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      border: 2px solid #22344a;
      transition: all 0.3s;
    }

    .empty {
      cursor: default;
    }

    .date.available {
      background: #101d30;
      border-color: #22344a;
    }

    .date.available:hover {
      background: #142743;
      border-color: #5ec7ff;
    }

    .date.inactive {
      background: #0a121e;
      border-color: #1a2a3d;
      color: #4f6478;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .date.today {
      background: #1d4f80;
      color: #eaf6ff;
      border-color: #5ec7ff;
    }

    .date.selected {
      background: #7ad6ff;
      color: #04101f;
      border-color: #7ad6ff;
    }

    @media (max-width: 768px) {
      .calendar {
        padding: 1rem;
      }

      .calendar-header {
        margin-bottom: 1rem;
      }

      .calendar-header h2 {
        font-size: 1.05rem;
        min-width: 0;
        flex: 1;
      }

      .nav-btn {
        padding: 0.45rem 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .weekdays,
      .dates {
        gap: 0.25rem;
      }

      .weekday {
        padding: 0.25rem 0;
        font-size: 0.72rem;
      }

      .date,
      .empty {
        font-size: 0.82rem;
        border-width: 1px;
      }
    }
  `]
})
export class CalendarComponent {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  currentDate = new Date();
  daysInMonth: number[] = [];
  emptyDays: null[] = [];
  monthYear = '';

  ngOnInit() {
    this.updateCalendar();
  }

  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
    this.monthYear = formatter.format(this.currentDate).charAt(0).toUpperCase() + formatter.format(this.currentDate).slice(1);

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    this.emptyDays = Array(firstDay).fill(null);
    this.daysInMonth = Array.from({ length: lastDay }, (_, i) => i + 1);
  }

  previousMonth() {
    if (this.isCurrentMonth()) {
      return;
    }

    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = new Date(this.currentDate);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = new Date(this.currentDate);
    this.updateCalendar();
  }

  selectDate(day: number) {
    if (this.isAvailable(day)) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      this.selectedDate = date;
      this.dateSelected.emit(date);
    }
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getFullYear() === this.currentDate.getFullYear()
    );
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  isAvailable(day: number): boolean {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  isCurrentMonth(): boolean {
    const today = new Date();
    return (
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }
}

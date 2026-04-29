export interface Appointment {
  id: string;
  salonId: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDTO {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  startTime: string;
  notes?: string;
}

export type SalonRequestStatus = 'pending' | 'approved' | 'rejected';

export interface SalonRequest {
  id: string;
  userId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  salonName: string;
  slugRequested: string;
  city?: string;
  notes?: string;
  status: SalonRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalonRequestDTO {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  salonName: string;
  slugRequested: string;
  city?: string;
  notes?: string;
}

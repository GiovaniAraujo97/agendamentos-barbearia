export interface Salon {
  id: string;
  name: string;
  email: string;
  phone: string;
  slug: string; // Para URL amigável
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
  color?: string; // Cor tema do salão
  ownerId: string;
  operatingHours: OperatingHours;
  services: Service[];
  professionals: Professional[];
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
}

export interface TimeRange {
  open: string; // HH:mm
  close: string; // HH:mm
  closed?: boolean;
}

export interface CreateSalonDTO {
  name: string;
  email: string;
  phone: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  salonId: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  salonId: string;
  specialties: string[]; // IDs de serviços
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  salonId: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  isActive?: boolean;
}

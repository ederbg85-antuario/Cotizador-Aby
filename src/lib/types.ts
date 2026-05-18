export type ServiceType = 'acrilico' | 'retoque' | 'gel';

export type GelServiceId = 'gel-manos' | 'gel-pies' | 'acripie';

export type NailLength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DecorationCategory = 'tecnica' | 'nail-art' | 'cristales' | 'extras';

export interface Decoration {
  id: string;
  name: string;
  pricePerNail: number;
  category: DecorationCategory;
  description?: string;
}

export interface GelService {
  id: GelServiceId;
  name: string;
  price: number;
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  unit: 'servicio' | 'tono' | 'uña';
}

export interface SelectedDecoration {
  decorationId: string;
  nailCount: number;
}

export interface SelectedAdditionalService {
  serviceId: string;
  quantity: number;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Quote {
  id: string;
  clientInfo: ClientInfo;
  serviceType: ServiceType;
  nailLength?: NailLength;
  gelServiceId?: GelServiceId;
  decorations: SelectedDecoration[];
  extraTones: number;
  additionalServices: SelectedAdditionalService[];
  notes: string;
  totalPrice: number;
  status: 'borrador' | 'enviada' | 'confirmada' | 'completada' | 'cancelada';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  quote: Quote;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pendiente' | 'confirmada' | 'en-progreso' | 'completada' | 'cancelada';
  notes: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'staff';
  tenantId: string;
  avatar?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

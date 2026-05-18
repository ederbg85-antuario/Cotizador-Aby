import { create } from 'zustand';
import type {
  ServiceType,
  GelServiceId,
  NailLength,
  SelectedDecoration,
  SelectedAdditionalService,
  ClientInfo,
  Quote,
  Order,
} from './types';
import {
  ACRILICO_PRICES,
  RETOQUE_PRICES,
  GEL_SERVICES,
  getDecorationById,
  getAdditionalServiceById,
  EXTRA_TONE_PRICE,
} from './pricing-data';

// ============================================================
// STORE TYPES
// ============================================================
interface QuoteBuilderState {
  serviceType: ServiceType | null;
  nailLength: NailLength | null;
  gelServiceId: GelServiceId | null;
  decorations: SelectedDecoration[];
  extraTones: number;
  additionalServices: SelectedAdditionalService[];
  clientInfo: ClientInfo;
  notes: string;
  totalPrice: number;
}

interface OrdersState {
  orders: Order[];
  quotes: Quote[];
}

interface UIState {
  sidebarOpen: boolean;
  currentView: 'cotizador' | 'pedidos' | 'configuracion';
}

interface QuoteActions {
  setServiceType: (type: ServiceType) => void;
  setNailLength: (length: NailLength) => void;
  setGelService: (id: GelServiceId) => void;
  addDecoration: (decorationId: string) => void;
  removeDecoration: (decorationId: string) => void;
  updateDecorationNails: (decorationId: string, nailCount: number) => void;
  setExtraTones: (count: number) => void;
  toggleAdditionalService: (serviceId: string) => void;
  setAdditionalQuantity: (serviceId: string, quantity: number) => void;
  setClientInfo: (info: Partial<ClientInfo>) => void;
  setNotes: (notes: string) => void;
  resetQuote: () => void;
  saveQuote: () => Quote;
}

interface OrderActions {
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setView: (view: UIState['currentView']) => void;
}

export type AppState = QuoteBuilderState & OrdersState & UIState & QuoteActions & OrderActions & UIActions;

// ============================================================
// CALCULATE TOTAL
// ============================================================
function calculateTotal(state: QuoteBuilderState): number {
  let total = 0;

  // 1. Base price
  if (state.serviceType === 'acrilico' && state.nailLength) {
    total += ACRILICO_PRICES[state.nailLength];
  } else if (state.serviceType === 'retoque' && state.nailLength) {
    total += RETOQUE_PRICES[state.nailLength];
  } else if (state.serviceType === 'gel' && state.gelServiceId) {
    const gel = GEL_SERVICES.find(g => g.id === state.gelServiceId);
    if (gel) total += gel.price;
  }

  // 2. Decorations: price per nail * number of nails
  for (const dec of state.decorations) {
    const info = getDecorationById(dec.decorationId);
    if (info) total += info.pricePerNail * dec.nailCount;
  }

  // 3. Extra tones ($5 each)
  if (state.extraTones > 0) {
    total += state.extraTones * EXTRA_TONE_PRICE;
  }

  // 4. Additional services
  for (const svc of state.additionalServices) {
    const info = getAdditionalServiceById(svc.serviceId);
    if (info) total += info.price * svc.quantity;
  }

  return total;
}

// ============================================================
// INITIAL STATE
// ============================================================
const initialQuoteState: QuoteBuilderState = {
  serviceType: null,
  nailLength: null,
  gelServiceId: null,
  decorations: [],
  extraTones: 0,
  additionalServices: [],
  clientInfo: { name: '', email: '', phone: '' },
  notes: '',
  totalPrice: 0,
};

// ============================================================
// STORE
// ============================================================
export const useAppStore = create<AppState>((set, get) => ({
  ...initialQuoteState,
  orders: [],
  quotes: [],
  sidebarOpen: false,
  currentView: 'cotizador',

  // --- Quote Builder ---
  setServiceType: (type) => {
    set(s => {
      const next = { ...s, serviceType: type, gelServiceId: type !== 'gel' ? null : s.gelServiceId };
      return { ...next, totalPrice: calculateTotal(next) };
    });
  },

  setNailLength: (length) => {
    set(s => {
      const next = { ...s, nailLength: length };
      return { ...next, totalPrice: calculateTotal(next) };
    });
  },

  setGelService: (id) => {
    set(s => {
      const next = { ...s, gelServiceId: id };
      return { ...next, totalPrice: calculateTotal(next) };
    });
  },

  addDecoration: (decorationId) => {
    set(s => {
      const exists = s.decorations.find(d => d.decorationId === decorationId);
      const decorations = exists
        ? s.decorations
        : [...s.decorations, { decorationId, nailCount: 1 }];
      const next = { ...s, decorations };
      return { decorations, totalPrice: calculateTotal(next) };
    });
  },

  removeDecoration: (decorationId) => {
    set(s => {
      const decorations = s.decorations.filter(d => d.decorationId !== decorationId);
      const next = { ...s, decorations };
      return { decorations, totalPrice: calculateTotal(next) };
    });
  },

  updateDecorationNails: (decorationId, nailCount) => {
    set(s => {
      const decorations = s.decorations.map(d =>
        d.decorationId === decorationId ? { ...d, nailCount: Math.max(0, Math.min(10, nailCount)) } : d
      );
      const next = { ...s, decorations };
      return { decorations, totalPrice: calculateTotal(next) };
    });
  },

  setExtraTones: (count) => {
    set(s => {
      const extraTones = Math.max(0, count);
      const next = { ...s, extraTones };
      return { extraTones, totalPrice: calculateTotal(next) };
    });
  },

  toggleAdditionalService: (serviceId) => {
    set(s => {
      const exists = s.additionalServices.find(a => a.serviceId === serviceId);
      const additionalServices = exists
        ? s.additionalServices.filter(a => a.serviceId !== serviceId)
        : [...s.additionalServices, { serviceId, quantity: 1 }];
      const next = { ...s, additionalServices };
      return { additionalServices, totalPrice: calculateTotal(next) };
    });
  },

  setAdditionalQuantity: (serviceId, quantity) => {
    set(s => {
      const additionalServices = s.additionalServices.map(a =>
        a.serviceId === serviceId ? { ...a, quantity: Math.max(1, quantity) } : a
      );
      const next = { ...s, additionalServices };
      return { additionalServices, totalPrice: calculateTotal(next) };
    });
  },

  setClientInfo: (info) => {
    set(s => ({ clientInfo: { ...s.clientInfo, ...info } }));
  },

  setNotes: (notes) => set({ notes }),

  resetQuote: () => set({ ...initialQuoteState }),

  saveQuote: () => {
    const s = get();
    const quote: Quote = {
      id: crypto.randomUUID(),
      clientInfo: s.clientInfo,
      serviceType: s.serviceType || 'acrilico',
      nailLength: s.nailLength || undefined,
      gelServiceId: s.gelServiceId || undefined,
      decorations: s.decorations,
      extraTones: s.extraTones,
      additionalServices: s.additionalServices,
      notes: s.notes,
      totalPrice: s.totalPrice,
      status: 'borrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => ({ quotes: [...state.quotes, quote] }));
    return quote;
  },

  // --- Orders ---
  addOrder: (order) => set(s => ({ orders: [...s.orders, order] })),
  updateOrder: (id, data) => set(s => ({
    orders: s.orders.map(o => o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString() } : o),
  })),
  deleteOrder: (id) => set(s => ({ orders: s.orders.filter(o => o.id !== id) })),

  // --- UI ---
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setView: (view) => set({ currentView: view }),
}));

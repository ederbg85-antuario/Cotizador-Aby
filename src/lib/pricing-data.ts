import type { Decoration, GelService, AdditionalService, NailLength } from './types';

// ============================================================
// PRECIOS BASE POR LARGO - ACRÍLICO Y RETOQUE
// ============================================================
export const ACRILICO_PRICES: Record<NailLength, number> = {
  1: 300, 2: 320, 3: 340, 4: 400, 5: 440,
  6: 480, 7: 520, 8: 560, 9: 600,
};

export const RETOQUE_PRICES: Record<NailLength, number> = {
  1: 280, 2: 300, 3: 320, 4: 380, 5: 420,
  6: 460, 7: 500, 8: 540, 9: 580,
};

// ============================================================
// SERVICIOS DE GEL
// ============================================================
export const GEL_SERVICES: GelService[] = [
  { id: 'gel-manos', name: 'Gel Semipermanente Manos', price: 200 },
  { id: 'gel-pies', name: 'Gel Semipermanente Pies', price: 200 },
  { id: 'acripie', name: 'Acripie', price: 250 },
];

// ============================================================
// DECORACIONES (precio por uña)
// ============================================================
export const DECORATIONS: Decoration[] = [
  // --- Técnica / Efecto ---
  { id: 'tecnica-efecto', name: 'Técnica / Efecto', pricePerNail: 5, category: 'tecnica' },
  { id: 'espejo', name: 'Espejo', pricePerNail: 5, category: 'tecnica' },
  { id: 'aurora', name: 'Aurora', pricePerNail: 5, category: 'tecnica' },
  { id: 'azucar', name: 'Azúcar', pricePerNail: 5, category: 'tecnica' },
  { id: 'sueter', name: 'Suéter', pricePerNail: 5, category: 'tecnica' },
  { id: 'perla', name: 'Perla', pricePerNail: 5, category: 'tecnica' },
  { id: 'glitter', name: 'Glitter', pricePerNail: 15, category: 'tecnica' },
  { id: 'carey', name: 'Carey', pricePerNail: 5, category: 'tecnica' },
  { id: 'blooming', name: 'Blooming', pricePerNail: 5, category: 'tecnica' },
  { id: 'ojo-de-gato', name: 'Ojo de gato', pricePerNail: 10, category: 'tecnica' },
  // --- Nail Art ---
  { id: 'relieve', name: 'Relieve', pricePerNail: 15, category: 'nail-art' },
  { id: '3d', name: '3D', pricePerNail: 5, category: 'nail-art' },
  { id: 'frances', name: 'Francés', pricePerNail: 5, category: 'nail-art' },
  { id: 'nail-art-simple', name: 'Nail art simple', pricePerNail: 15, category: 'nail-art' },
  { id: 'nail-art-complicado', name: 'Nail art complicado', pricePerNail: 10, category: 'nail-art' },
  { id: 'encapsulado', name: 'Encapsulado', pricePerNail: 10, category: 'nail-art' },
  { id: 'naturaleza-muerta', name: 'Naturaleza muerta', pricePerNail: 15, category: 'nail-art' },
  // --- Extras ---
  { id: 'dijes', name: 'Dijes', pricePerNail: 5, category: 'extras' },
  { id: 'sticker', name: 'Sticker', pricePerNail: 15, category: 'extras' },
  { id: 'baby-boomer', name: 'Baby boomer', pricePerNail: 2, category: 'extras' },
  // --- Cristales ---
  { id: 'cristales-ch', name: 'Cristales Ch', pricePerNail: 5, category: 'cristales' },
  { id: 'cristales-m', name: 'Cristales M', pricePerNail: 50, category: 'cristales' },
  { id: 'una-completa-cristal-ch', name: 'Uña completa cristal Ch (Largo 1-3)', pricePerNail: 80, category: 'cristales' },
  { id: 'una-completa-cristal-m', name: 'Uña completa cristal M (Largo 4-6)', pricePerNail: 100, category: 'cristales' },
  { id: 'una-completa-cristal-g', name: 'Uña completa cristal G (Largo 7-9)', pricePerNail: 120, category: 'cristales' },
];

// ============================================================
// SERVICIOS ADICIONALES
// ============================================================
export const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: 'cambio-forma', name: 'Cambio de forma', price: 30, unit: 'servicio' },
  { id: 'bano-acrilico', name: 'Baño de acrílico', price: 300, unit: 'servicio' },
  { id: 'punta-almendra', name: 'Punta almendra o stiletto', price: 30, unit: 'servicio' },
  { id: 'tono-extra', name: 'Tono extra', price: 5, unit: 'tono' },
  { id: 'retiro-mio', name: 'Retiro (trabajo mío)', price: 100, unit: 'servicio' },
  { id: 'retiro-no-mio', name: 'Retiro (no trabajo mío)', price: 150, unit: 'servicio' },
  { id: 'cambio-forma-una', name: 'Cambio de forma (por uña)', price: 20, unit: 'uña' },
  { id: 'retiro-acrilico-una', name: 'Retiro acrílico (por uña)', price: 10, unit: 'uña' },
  { id: 'retiro-gel-una', name: 'Retiro gel semipermanente (por uña)', price: 8, unit: 'uña' },
  { id: 'reposicion-acrilico', name: 'Reposición acrílico (por uña)', price: 30, unit: 'uña' },
  { id: 'reposicion-gel', name: 'Reposición gel (por uña)', price: 20, unit: 'uña' },
];

// Cada técnica incluye 2 tonos lisos
export const INCLUDED_TONES = 2;
export const EXTRA_TONE_PRICE = 5;

// ============================================================
// HELPERS
// ============================================================
export const getDecorationById = (id: string) => DECORATIONS.find(d => d.id === id);
export const getAdditionalServiceById = (id: string) => ADDITIONAL_SERVICES.find(s => s.id === id);
export const getGelServiceById = (id: string) => GEL_SERVICES.find(s => s.id === id);

export const getDecorationsByCategory = (category: Decoration['category']) =>
  DECORATIONS.filter(d => d.category === category);

export const CATEGORY_LABELS: Record<Decoration['category'], string> = {
  tecnica: 'Técnicas / Efectos',
  'nail-art': 'Nail Art',
  cristales: 'Cristales',
  extras: 'Extras',
};

export const SALON_INFO = {
  name: 'Cotizador de Aby',
  tagline: 'Belleza en tus manos',
  phone: '',
  email: '',
  instagram: '',
};

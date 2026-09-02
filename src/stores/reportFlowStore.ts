import { create } from 'zustand';
import type { ReportDraft } from '@/types/database';

type ReportFlowState = {
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  observedAt: string | null;
  subcategory: string | null;
  title: string | null;
  description: string | null;
  severity: string | null;
  speciesName: string | null;
  quantityEstimate: string | null;
  aliveStatus: string | null;
  setPhoto: (uri: string | null) => void;
  setLocation: (lat: number, lng: number, accuracy: number | null, observedAt: string) => void;
  setCategory: (subcategory: string) => void;
  setDetails: (details: Partial<Omit<ReportFlowState, 'setPhoto' | 'setLocation' | 'setCategory' | 'setDetails' | 'reset'>>) => void;
  reset: () => void;
  toDraft: () => Omit<ReportDraft, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'errorMessage'>;
};

const initialState = {
  photoUri: null,
  latitude: null,
  longitude: null,
  locationAccuracy: null,
  observedAt: null,
  subcategory: null,
  title: null,
  description: null,
  severity: null,
  speciesName: null,
  quantityEstimate: null,
  aliveStatus: null,
};

export const useReportFlowStore = create<ReportFlowState>((set, get) => ({
  ...initialState,
  setPhoto: (uri) => set({ photoUri: uri }),
  setLocation: (latitude, longitude, locationAccuracy, observedAt) =>
    set({ latitude, longitude, locationAccuracy, observedAt }),
  setCategory: (subcategory) => set({ subcategory }),
  setDetails: (details) => set(details),
  reset: () => set(initialState),
  toDraft: () => {
    const s = get();
    return {
      localPhotoUri: s.photoUri,
      latitude: s.latitude,
      longitude: s.longitude,
      locationAccuracy: s.locationAccuracy,
      observedAt: s.observedAt,
      subcategory: s.subcategory,
      title: s.title,
      description: s.description,
      severity: s.severity,
      speciesName: s.speciesName,
      quantityEstimate: s.quantityEstimate,
      aliveStatus: s.aliveStatus,
    };
  },
}));

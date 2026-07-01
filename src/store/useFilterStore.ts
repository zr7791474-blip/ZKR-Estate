import { create } from "zustand";

interface Filters {
  city: string;
  status: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterState extends Filters {
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
}

const initial: Filters = {
  city: "",
  status: "",
  type: "",
  bedrooms: "",
  bathrooms: "",
  minPrice: "",
  maxPrice: ""
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set(initial)
}));
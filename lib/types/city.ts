export interface City {
  id: string;
  name: string;
  country: string;
  population: number;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
  admin2?: string;
  elevation?: number;
}

export interface CitiesResponse {
  records: {
    recordid: string;
    fields: {
      name: string;
      cou_name_en: string;
      population: number;
      coordinates: [number, number]; // [longitude, latitude]
      timezone: string;
      ascii_name?: string;
      admin1_name?: string;
      admin2_name?: string;
      admin3_name?: string;
      admin4_name?: string;
      modification_date?: string;
      elevation?: number;
    };
  }[];
  total_count: number;
  nhits: number;
}

export interface CitySearchParams {
  q?: string;
  rows?: number;
  start?: number;
  sort?: string;
  refine?: Record<string, string | number>;
}

export interface CitiesState {
  data: City[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  total: number;
}
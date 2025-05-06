import { CitiesResponse, City, CitySearchParams } from '@/lib/types/city';
import { formatCityUrl, parseCityId } from '@/lib/format-utils';

const BASE_URL = 'https://public.opendatasoft.com/api/records/1.0/search/';
const DATASET = 'geonames-all-cities-with-a-population-1000';

const transformCity = (record: CitiesResponse['records'][0]): City => {
  const fields = record.fields;
  
  // Create a unique ID from the name and recordid
  const id = formatCityUrl(fields.name, record.recordid);
  
  return {
    id,
    name: fields.name,
    country: fields.cou_name_en,
    population: fields.population,
    longitude: fields.coordinates[0],
    latitude: fields.coordinates[1],
    timezone: fields.timezone,
    admin1: fields.admin1_name,
    admin2: fields.admin2_name,
    elevation: fields.elevation
  };
};

export async function getCities(params: CitySearchParams = {}): Promise<{
  cities: City[],
  total: number
}> {
  const searchParams = new URLSearchParams({
    dataset: DATASET,
    rows: params.rows?.toString() || '20',
    start: params.start?.toString() || '0',
  });

  if (params.q) {
    searchParams.append('q', params.q);
  }

  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  if (params.refine) {
    Object.entries(params.refine).forEach(([key, value]) => {
      searchParams.append(`refine.${key}`, value.toString());
    });
  }

  try {
    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`);
    }
    
    const data = await response.json() as CitiesResponse;
    
    return {
      cities: data.records.map(transformCity),
      total: data.nhits
    };
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

export async function getCityById(cityId: string): Promise<City | null> {
  try {
    const { name, recordId } = parseCityId(cityId);
    
    const searchParams = new URLSearchParams({
      dataset: DATASET,
      q: name,
      rows: '10'
    });
    
    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch city: ${response.status}`);
    }
    
    const data = await response.json() as CitiesResponse;
    
    // Find the exact city by recordId
    const cityRecord = data.records.find(record => record.recordid === recordId);
    
    if (!cityRecord) {
      // If not found by recordId, just return the first result
      return data.records.length > 0 ? transformCity(data.records[0]) : null;
    }
    
    return transformCity(cityRecord);
  } catch (error) {
    console.error('Error fetching city by id:', error);
    return null;
  }
}
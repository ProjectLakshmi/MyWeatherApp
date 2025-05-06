import { City } from '@/lib/types/city';
import { CurrentWeather, WeatherForecast } from '@/lib/types/weather';

interface CachedWeatherData {
  current: CurrentWeather;
  forecast: WeatherForecast;
  timestamp: number;
}

interface WeatherCache {
  [cityId: string]: CachedWeatherData;
}

// Cache expiration time: 30 minutes
const CACHE_EXPIRATION = 30 * 60 * 1000; 

let weatherCache: WeatherCache = {};

export function getCachedWeather(cityId: string): CachedWeatherData | null {
  const cachedData = weatherCache[cityId];
  
  if (!cachedData) {
    return null;
  }
  
  // Check if data is still valid
  const now = Date.now();
  if (now - cachedData.timestamp > CACHE_EXPIRATION) {
    // Data is expired, remove it from cache
    delete weatherCache[cityId];
    return null;
  }
  
  return cachedData;
}

export function setCachedWeather(
  cityId: string,
  current: CurrentWeather,
  forecast: WeatherForecast
): void {
  weatherCache[cityId] = {
    current,
    forecast,
    timestamp: Date.now()
  };
}

// Get basic weather data for displaying in cities table
export function getCachedCityBasicWeather(cityId: string): {
  temp?: number;
  temp_min?: number;
  temp_max?: number;
  weather_description?: string;
  weather_icon?: string;
} {
  const cachedData = getCachedWeather(cityId);
  
  if (!cachedData) {
    return {};
  }
  
  return {
    temp: cachedData.current.temp,
    temp_min: cachedData.current.temp_min,
    temp_max: cachedData.current.temp_max,
    weather_description: cachedData.current.weather[0]?.description,
    weather_icon: cachedData.current.weather[0]?.icon
  };
}

export function clearWeatherCache(): void {
  weatherCache = {};
}
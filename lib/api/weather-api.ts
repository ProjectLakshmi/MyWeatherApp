import { CurrentWeather, WeatherForecast, Unit } from '@/lib/types/weather';

// OpenWeatherMap API key
// Note: In a production environment, this would be stored in environment variables
const API_KEY = 'a5c39655ef6fedf4321f96a550ed5491';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: Unit = 'metric'
): Promise<CurrentWeather> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch current weather: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match our CurrentWeather interface
    return {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      clouds: data.clouds.all,
      visibility: data.visibility,
      weather: data.weather,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      dt: data.dt
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

export async function getWeatherForecast(
  lat: number,
  lon: number,
  units: Unit = 'metric'
): Promise<WeatherForecast> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather forecast: ${response.status}`);
    }
    
    const data = await response.json();
    return data as WeatherForecast;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}

// Get both current weather and forecast in a single function
export async function getCityWeather(
  lat: number,
  lon: number,
  units: Unit = 'metric'
): Promise<{
  current: CurrentWeather,
  forecast: WeatherForecast
}> {
  try {
    const [current, forecast] = await Promise.all([
      getCurrentWeather(lat, lon, units),
      getWeatherForecast(lat, lon, units)
    ]);
    
    return { current, forecast };
  } catch (error) {
    console.error('Error fetching city weather data:', error);
    throw error;
  }
}

export function getWeatherIconUrl(iconCode: string, size: 2 | 4 = 2): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}x.png`;
}
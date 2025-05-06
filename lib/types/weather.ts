export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  visibility: number;
  weather: WeatherCondition[];
  sunrise: number;
  sunset: number;
  dt: number; // timestamp
}

export interface ForecastItem {
  dt: number; // timestamp
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number; // probability of precipitation
  sys: {
    pod: string; // part of day (n - night, d - day)
  };
  dt_txt: string; // date/time in text format
}

export interface WeatherForecast {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherData {
  current: CurrentWeather | null;
  forecast: WeatherForecast | null;
  isLoading: boolean;
  error: string | null;
}

export type Unit = 'metric' | 'imperial';
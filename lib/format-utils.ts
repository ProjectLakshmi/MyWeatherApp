import { format, fromUnixTime } from 'date-fns';

// Format city name into URL-friendly format
export function formatCityUrl(name: string, id: string): string {
  return `${name.toLowerCase().replace(/[^\w]/g, '-')}-${id}`;
}

// Parse city ID from URL format
export function parseCityId(cityId: string): { name: string; recordId: string } {
  const parts = cityId.split('-');
  
  // The last part is the record ID
  const recordId = parts.pop() || '';
  
  // The rest is the city name
  const name = parts.join('-');
  
  return { name, recordId };
}

// Format temperature based on units
export function formatTemperature(temp: number, units: 'metric' | 'imperial'): string {
  const rounded = Math.round(temp);
  const symbol = units === 'metric' ? '°C' : '°F';
  return `${rounded}${symbol}`;
}

// Format wind speed based on units
export function formatWindSpeed(speed: number, units: 'metric' | 'imperial'): string {
  const unitLabel = units === 'metric' ? 'm/s' : 'mph';
  return `${speed.toFixed(1)} ${unitLabel}`;
}

// Format date from unix timestamp
export function formatDate(timestamp: number, formatStr: string = 'EEEE, MMMM d'): string {
  return format(fromUnixTime(timestamp), formatStr);
}

// Format time from unix timestamp
export function formatTime(timestamp: number, formatStr: string = 'h:mm a'): string {
  return format(fromUnixTime(timestamp), formatStr);
}

// Get time of day based on current hour
export function getTimeOfDay(hour: number): 'morning' | 'day' | 'evening' | 'night' {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Get background gradient based on weather condition and time
export function getWeatherBackground(
  weatherId: number,
  timeOfDay: 'morning' | 'day' | 'evening' | 'night'
): string {
  // Weather condition ranges:
  // 2xx: Thunderstorm
  // 3xx: Drizzle
  // 5xx: Rain
  // 6xx: Snow
  // 7xx: Atmosphere (fog, dust, etc)
  // 800: Clear
  // 80x: Clouds
  
  if (weatherId >= 200 && weatherId < 300) {
    return 'bg-gradient-to-b from-gray-700 via-gray-900 to-black';
  }
  
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900';
  }
  
  if (weatherId >= 600 && weatherId < 700) {
    return 'bg-gradient-to-b from-gray-100 via-blue-100 to-white';
  }
  
  if (weatherId >= 700 && weatherId < 800) {
    return 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600';
  }
  
  if (weatherId === 800) {
    if (timeOfDay === 'morning') {
      return 'bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50';
    }
    if (timeOfDay === 'day') {
      return 'bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200';
    }
    if (timeOfDay === 'evening') {
      return 'bg-gradient-to-b from-orange-400 via-purple-400 to-blue-500';
    }
    return 'bg-gradient-to-b from-blue-900 via-blue-800 to-gray-900';
  }
  
  if (weatherId > 800) {
    if (timeOfDay === 'night') {
      return 'bg-gradient-to-b from-gray-800 via-gray-900 to-black';
    }
    return 'bg-gradient-to-b from-gray-300 via-blue-200 to-blue-100';
  }
  
  // Default fallback
  return 'bg-gradient-to-b from-blue-500 to-blue-700';
}
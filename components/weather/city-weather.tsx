'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCityWeather } from '@/lib/hooks/use-city-weather';
import { CurrentWeather as CurrentWeatherType } from '@/lib/types/weather';
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatDate, 
  formatTime,
  getTimeOfDay,
  getWeatherBackground
} from '@/lib/format-utils';
import { getWeatherIconUrl } from '@/lib/api/weather-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Droplets, Wind, Gauge, Sunrise, Sunset, RefreshCw } from 'lucide-react';
import { ForecastSection } from '@/components/weather/forecast-section';

function WeatherSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-24 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CurrentWeather({ current, units }: { 
  current: CurrentWeatherType;
  units: 'metric' | 'imperial';
}) {
  const date = new Date(current.dt * 1000);
  const hour = date.getHours();
  const timeOfDay = getTimeOfDay(hour);
  const weatherId = current.weather[0]?.id || 800;
  const backgroundClass = getWeatherBackground(weatherId, timeOfDay);
  
  const infoItems = [
    {
      icon: <Droplets className="h-5 w-5" />,
      label: 'Humidity',
      value: `${current.humidity}%`
    },
    {
      icon: <Wind className="h-5 w-5" />,
      label: 'Wind',
      value: formatWindSpeed(current.wind_speed, units)
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Pressure',
      value: `${current.pressure} hPa`
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg overflow-hidden mb-8 text-white`}
    >
      <div className={`${backgroundClass} p-6 md:p-8 rounded-lg shadow-lg`}>
        <div className="text-center md:text-left md:flex md:justify-between md:items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">{formatDate(current.dt)}</h2>
            <p className="text-lg opacity-90">{formatTime(current.dt)}</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex flex-col items-center mr-4">
              <Sunrise className="h-5 w-5 mb-1" />
              <span className="text-sm">{formatTime(current.sunrise)}</span>
            </div>
            <div className="flex flex-col items-center">
              <Sunset className="h-5 w-5 mb-1" />
              <span className="text-sm">{formatTime(current.sunset)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mt-6">
          <div className="flex items-center">
            <Image 
              src={getWeatherIconUrl(current.weather[0]?.icon || '01d', 4)}
              alt={current.weather[0]?.description || 'Weather'}
              width={100}
              height={100}
              className="mr-4"
            />
            <div>
              <h1 className="text-5xl font-bold">
                {formatTemperature(current.temp, units)}
              </h1>
              <p className="text-xl capitalize mt-1">
                {current.weather[0]?.description}
              </p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4">
            <div className="text-center">
              <p className="font-medium">Feels Like</p>
              <p className="text-2xl font-bold">
                {formatTemperature(current.feels_like, units)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium">High</p>
              <p className="text-2xl font-bold">
                {formatTemperature(current.temp_max, units)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium">Low</p>
              <p className="text-2xl font-bold">
                {formatTemperature(current.temp_min, units)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {infoItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center"
            >
              <div className="flex items-center mb-2">
                {item.icon}
                <span className="ml-2 text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-lg font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface CityWeatherProps {
  cityId: string;
}

export function CityWeather({ cityId }: CityWeatherProps) {
  const { 
    current, 
    forecast, 
    isLoading, 
    error, 
    units, 
    toggleUnits 
  } = useCityWeather(cityId);
  
  if (isLoading) {
    return <WeatherSkeleton />;
  }
  
  if (error || !current || !forecast) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">
          {error || 'Failed to load weather data'}
        </h3>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button variant="outline" onClick={toggleUnits}>
          Switch to {units === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </Button>
      </div>
      
      <CurrentWeather current={current} units={units} />
      
      <ForecastSection forecast={forecast} units={units} />
    </div>
  );
}
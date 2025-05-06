'use client';

import { useState, useEffect } from 'react';
import { WeatherData, Unit } from '@/lib/types/weather';
import { getCityWeather } from '@/lib/api/weather-api';
import { getCityById } from '@/lib/api/cities-api';
import { getCachedWeather, setCachedWeather } from '@/lib/weather-cache';
import { toast } from 'sonner';
import { parseCityId } from '@/lib/format-utils';

export function useCityWeather(cityId: string, initialUnits: Unit = 'metric') {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: null,
    forecast: null,
    isLoading: true,
    error: null
  });
  
  const [units, setUnits] = useState<Unit>(initialUnits);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchWeatherData = async () => {
      try {
        setWeatherData(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Check if we have cached data first
        const cachedData = getCachedWeather(cityId);
        
        if (cachedData) {
          if (isMounted) {
            setWeatherData({
              current: cachedData.current,
              forecast: cachedData.forecast,
              isLoading: false,
              error: null
            });
          }
          return;
        }
        
        // No cached data, need to fetch from API
        const city = await getCityById(cityId);
        
        if (!city) {
          throw new Error('City not found');
        }
        
        const { current, forecast } = await getCityWeather(
          city.latitude,
          city.longitude,
          units
        );
        
        // Cache the data
        setCachedWeather(cityId, current, forecast);
        
        if (isMounted) {
          setWeatherData({
            current,
            forecast,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
          setWeatherData(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage
          }));
          toast.error(errorMessage);
        }
      }
    };
    
    fetchWeatherData();
    
    return () => {
      isMounted = false;
    };
  }, [cityId, units]);
  
  const toggleUnits = () => {
    setUnits(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };
  
  return {
    ...weatherData,
    units,
    toggleUnits
  };
}
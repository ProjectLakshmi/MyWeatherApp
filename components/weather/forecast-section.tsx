'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format, fromUnixTime, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherForecast, ForecastItem } from '@/lib/types/weather';
import { formatTemperature } from '@/lib/format-utils';
import { getWeatherIconUrl } from '@/lib/api/weather-api';
import { Droplets } from 'lucide-react';

interface ForecastDayProps {
  day: {
    date: Date;
    icon: string;
    description: string;
    tempMin: number;
    tempMax: number;
    pop: number; // probability of precipitation
  };
  units: 'metric' | 'imperial';
}

function ForecastDay({ day, units }: ForecastDayProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-card rounded-lg overflow-hidden shadow-md"
    >
      <div className="bg-primary/10 p-4">
        <h3 className="font-semibold text-center">
          {format(day.date, 'EEEE')}
        </h3>
        <p className="text-sm text-center text-muted-foreground">
          {format(day.date, 'MMM d')}
        </p>
      </div>
      
      <div className="p-4 flex flex-col items-center">
        <motion.div variants={item}>
          <Image 
            src={getWeatherIconUrl(day.icon)}
            alt={day.description}
            width={50}
            height={50}
          />
        </motion.div>
        
        <motion.p variants={item} className="text-sm capitalize text-center mt-1">
          {day.description}
        </motion.p>
        
        <motion.div variants={item} className="flex justify-between w-full mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Min</p>
            <p className="font-semibold">
              {formatTemperature(day.tempMin, units)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Max</p>
            <p className="font-semibold">
              {formatTemperature(day.tempMax, units)}
            </p>
          </div>
        </motion.div>
        
        {day.pop > 0 && (
          <motion.div variants={item} className="flex items-center mt-3 text-primary">
            <Droplets className="h-4 w-4 mr-1" />
            <span className="text-sm">{Math.round(day.pop * 100)}%</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface ForecastSectionProps {
  forecast: WeatherForecast;
  units: 'metric' | 'imperial';
}

export function ForecastSection({ forecast, units }: ForecastSectionProps) {
  // Group forecast items by day and get min/max temps
  const dailyForecasts = useMemo(() => {
    const days = new Map<string, {
      date: Date;
      items: ForecastItem[];
      tempMin: number;
      tempMax: number;
      icon: string;
      description: string;
      pop: number;
    }>();
    
    const today = new Date();
    
    forecast.list.forEach(item => {
      const date = fromUnixTime(item.dt);
      
      // Skip today
      if (isSameDay(date, today)) {
        return;
      }
      
      const dayKey = format(date, 'yyyy-MM-dd');
      
      if (!days.has(dayKey)) {
        days.set(dayKey, {
          date,
          items: [],
          tempMin: Infinity,
          tempMax: -Infinity,
          icon: item.weather[0]?.icon || '01d',
          description: item.weather[0]?.description || 'unknown',
          pop: item.pop
        });
      }
      
      const day = days.get(dayKey)!;
      day.items.push(item);
      day.tempMin = Math.min(day.tempMin, item.main.temp_min);
      day.tempMax = Math.max(day.tempMax, item.main.temp_max);
      
      // For icon and description, prefer daytime values
      if (item.sys.pod === 'd') {
        day.icon = item.weather[0]?.icon || day.icon;
        day.description = item.weather[0]?.description || day.description;
      }
      
      // Update probability of precipitation to highest value
      day.pop = Math.max(day.pop, item.pop);
    });
    
    // Sort by date and limit to 5 days
    return Array.from(days.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [forecast]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => (
          <ForecastDay 
            key={format(day.date, 'yyyy-MM-dd')}
            day={{
              date: day.date,
              icon: day.icon,
              description: day.description,
              tempMin: day.tempMin,
              tempMax: day.tempMax,
              pop: day.pop
            }}
            units={units}
          />
        ))}
      </div>
    </section>
  );
}
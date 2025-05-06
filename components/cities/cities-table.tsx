'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import {
  Search,
  XCircle,
  SortAsc,
  SortDesc,
  Filter,
  User,
  Map,
  Clock,
  Thermometer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCities } from '@/lib/hooks/use-cities';
import { City } from '@/lib/types/city';
import { getWeatherIconUrl } from '@/lib/api/weather-api';
import { getCachedCityBasicWeather } from '@/lib/weather-cache';
import { formatTemperature } from '@/lib/format-utils';

const tempUnits = 'metric'; // Default units

function CityTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function CitiesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    data: cities,
    isLoading,
    error,
    total,
    debouncedSearch,
    handleSort,
    loadMoreRef,
  } = useCities();

  const columns = useMemo<ColumnDef<City>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>City</span>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
                handleSort('name', column.getIsSorted() === 'asc' ? 'desc' : 'asc');
              }}
            >
              {column.getIsSorted() === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const city = row.original;
          const weatherData = getCachedCityBasicWeather(city.id);
          
          return (
            <div className="flex items-center space-x-3">
              <div>
                <Link
                  href={`/city/${city.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {city.name}
                </Link>
                {weatherData.weather_icon ? (
                  <div className="flex items-center mt-1">
                    <Image
                      src={getWeatherIconUrl(weatherData.weather_icon)}
                      alt={weatherData.weather_description || ''}
                      width={24}
                      height={24}
                      className="inline mr-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      {weatherData.temp ? formatTemperature(weatherData.temp, tempUnits) : ''}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'country',
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <Map className="h-4 w-4" />
            <span>Country</span>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
                handleSort('cou_name_en', column.getIsSorted() === 'asc' ? 'desc' : 'asc');
              }}
            >
              {column.getIsSorted() === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => <div>{row.original.country}</div>,
      },
      {
        accessorKey: 'population',
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Population</span>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
                handleSort('population', column.getIsSorted() === 'asc' ? 'desc' : 'asc');
              }}
            >
              {column.getIsSorted() === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.population.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: 'timezone',
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Timezone</span>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
                handleSort('timezone', column.getIsSorted() === 'asc' ? 'desc' : 'asc');
              }}
            >
              {column.getIsSorted() === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }) => <div>{row.original.timezone}</div>,
      },
      {
        accessorKey: 'weather',
        header: ({ column }) => (
          <div className="flex items-center space-x-1">
            <Thermometer className="h-4 w-4" />
            <span>Weather</span>
          </div>
        ),
        cell: ({ row }) => {
          const city = row.original;
          const weatherData = getCachedCityBasicWeather(city.id);
          
          if (weatherData.temp_min !== undefined && weatherData.temp_max !== undefined) {
            return (
              <div className="text-right">
                <span className="text-primary font-medium">
                  {formatTemperature(weatherData.temp_min, tempUnits)}
                </span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-primary font-medium">
                  {formatTemperature(weatherData.temp_max, tempUnits)}
                </span>
              </div>
            );
          }
          
          return <div className="text-muted-foreground text-right">-</div>;
        },
      },
    ],
    [handleSort]
  );

  const table = useReactTable({
    data: cities,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-red-500">Error loading cities: {error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            className="pl-8"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1.5 h-7 w-7 p-0"
            onClick={() => debouncedSearch('')}
          >
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{cities.length}</span> of{' '}
          <span className="font-medium">{total}</span> cities
        </div>
      </div>

      <div className="rounded-md border">
        {isLoading && cities.length === 0 ? (
          <CityTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      window.open(`/city/${row.original.id}`, '_blank');
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Load more trigger element */}
      {isLoading && cities.length > 0 && (
        <div className="py-4 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <span>Loading more cities...</span>
          </div>
        </div>
      )}

      {/* Invisible element to trigger loading more data */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
}
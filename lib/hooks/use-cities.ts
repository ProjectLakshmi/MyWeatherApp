'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { City, CitiesState, CitySearchParams } from '@/lib/types/city';
import { getCities } from '@/lib/api/cities-api';
import { toast } from 'sonner';
import debounce from 'lodash.debounce';

const ROWS_PER_PAGE = 20;

export function useCities(initialParams: CitySearchParams = {}) {
  const [state, setState] = useState<CitiesState>({
    data: [],
    hasMore: true,
    isLoading: false,
    error: null,
    total: 0
  });
  
  const [searchParams, setSearchParams] = useState<CitySearchParams>({
    ...initialParams,
    rows: ROWS_PER_PAGE,
    start: 0
  });
  
  const { ref, inView } = useInView();
  
  const fetchCities = useCallback(async (params: CitySearchParams) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { cities, total } = await getCities(params);
      
      setState(prev => {
        // If we're starting from the beginning (not paginating), replace data
        // Otherwise, append new data
        const isReset = (params.start ?? 0) === 0;

        return {
          data: isReset ? cities : [...prev.data, ...cities],
          hasMore: (params.start ?? 0) + cities.length < total,
          isLoading: false,
          error: null,
          total
        };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      toast.error('Failed to load cities');
    }
  }, []);
  
  // Handle search query changes
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchParams(prev => ({
        ...prev,
        q: query,
        start: 0 // Reset pagination when search changes
      }));
    }, 300),
    []
  );
  
  // Handle sorting changes
  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSearchParams(prev => ({
      ...prev,
      sort: `${field} ${direction}`,
      start: 0 // Reset pagination when sorting changes
    }));
  }, []);
  
  // Handle filtering
  const handleFilter = useCallback((field: string, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      refine: { ...(prev.refine || {}), [field]: value },
      start: 0 // Reset pagination when filtering changes
    }));
  }, []);
  
  // Clear a specific filter
  const clearFilter = useCallback((field: string) => {
    setSearchParams(prev => {
      const newRefine = { ...(prev.refine || {}) };
      delete newRefine[field];
      
      return {
        ...prev,
        refine: Object.keys(newRefine).length > 0 ? newRefine : undefined,
        start: 0 // Reset pagination when clearing a filter
      };
    });
  }, []);
  
  // Clear all filters and search
  const clearAllFilters = useCallback(() => {
    setSearchParams(prev => ({
      rows: prev.rows,
      start: 0
    }));
  }, []);
  
  // Load more data (pagination)
  const loadMore = useCallback(() => {
    if (state.isLoading || !state.hasMore) return;
    
    setSearchParams(prev => ({
      ...prev,
      start: (prev.start ?? 0) + ROWS_PER_PAGE

    }));
  }, [state.isLoading, state.hasMore]);
  
  // Fetch cities on initial load and when searchParams change
  useEffect(() => {
    fetchCities(searchParams);
  }, [fetchCities, searchParams]);
  
  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);
  
  return {
    ...state,
    searchParams,
    debouncedSearch,
    handleSort,
    handleFilter,
    clearFilter,
    clearAllFilters,
    loadMoreRef: ref
  };
}

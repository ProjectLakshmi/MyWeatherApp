import { Container } from '@/components/container';
import { CityWeather } from '@/components/weather/city-weather';
import { PageHeader } from '@/components/page-header';
import { formatCityUrl } from '@/lib/format-utils';
import { getCityById } from '@/lib/api/cities-api';

export default async function CityPage({ params }: { params: { id: string } }) {
  // Decode the city name from the URL
  const cityNameWithId = decodeURIComponent(params.id);
  const cityInfo = await getCityById(cityNameWithId);
  
  const cityName = cityInfo?.name || cityNameWithId.split('-')[0];
  const countryName = cityInfo?.country || '';
  
  return (
    <Container>
      <PageHeader
        title={`${cityName}`}
        description={countryName}
        back={{
          href: '/',
          label: 'Back to Cities'
        }}
      />
      <CityWeather cityId={params.id} />
    </Container>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const cityNameWithId = decodeURIComponent(params.id);
  const cityInfo = await getCityById(cityNameWithId);
  
  const cityName = cityInfo?.name || cityNameWithId.split('-')[0];
  const countryName = cityInfo?.country || '';
  
  return {
    title: `${cityName} Weather - WeatherVue`,
    description: `Current weather and forecast for ${cityName}, ${countryName}`,
  };
}
import { CitiesTable } from '@/components/cities/cities-table';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';

export default function Home() {
  return (
    <Container>
      <PageHeader
        title="World Cities Weather"
        description="Search and explore weather data for cities around the world"
      />
      <CitiesTable />
    </Container>
  );
}
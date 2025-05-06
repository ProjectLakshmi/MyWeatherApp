import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  back?: BackButtonProps;
}

export function PageHeader({ 
  title, 
  description, 
  className,
  back
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {back && (
        <Link 
          href={back.href} 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {back.label}
        </Link>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle,
  className 
}) => {
  return (
    <header className={cn(
      "px-4 py-3 border-b bg-card/50 backdrop-blur-sm",
      className
    )}>
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default Header;

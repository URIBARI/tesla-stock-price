'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Tesla Stock Analysis</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/chart">
            <Button variant="ghost">Chart</Button>
          </Link>
          <Link href="/analysis">
            <Button variant="ghost">Analysis</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}


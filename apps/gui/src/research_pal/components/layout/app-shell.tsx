'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

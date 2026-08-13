'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/studio')) return;
    fetch('/api/track-view', { method: 'POST' }).catch(() => {});
  }, [pathname]);

  return null;
}

import React from 'react';
import dynamic from 'next/dynamic';

// Reuse the same UI in Pages Router
const NotFound = dynamic(() => import('../components/NotFound/NotFound'), {
  ssr: true,
});

export default function Custom404() {
  return <NotFound />;
}

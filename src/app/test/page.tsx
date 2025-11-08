// src/app/test/page.tsx
import { api } from '@/lib/api';

export default async function TestPage() {
  const data = await api<{ status: string; time: string }>('/api/health');
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Health check</h1>
      <pre className="mt-4">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}

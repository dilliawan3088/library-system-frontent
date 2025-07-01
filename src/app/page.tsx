'use client';

import { useState } from 'react';

const BASE_URL = 'http://127.0.0.1:8002';

export default function Home() {
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  const getValue = (id: string): string => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
    return el?.value || '';
  };

  const callAPI = async (
    method: string,
    endpoint: string,
    data: string | null,
    outputId: string
  ) => {
    setOutputs((prev) => ({ ...prev, [outputId]: 'Loading...' }));
    try {
      const res = await fetch(BASE_URL + endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data && method !== 'GET' && method !== 'DELETE' ? data : null,
      });

      const contentType = res.headers.get('content-type');
      const result =
        contentType && contentType.includes('application/json')
          ? await res.json()
          : await res.text();

      setOutputs((prev) => ({
        ...prev,
        [outputId]: JSON.stringify(result, null, 2),
      }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOutputs((prev) => ({
          ...prev,
          [outputId]: '❌ Error: ' + err.message,
        }));
      } else {
        setOutputs((prev) => ({
          ...prev,
          [outputId]: '❌ Unknown error occurred.',
        }));
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">

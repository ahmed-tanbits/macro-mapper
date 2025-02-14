'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying subscription...');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    if (sessionId) {
      setMessage('Subscription successful! Redirecting...');
      setTimeout(() => router.push('/'), 3000);
    } else {
      setMessage('No session found. Redirecting to home...');
      setTimeout(() => router.push('/'), 3000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">{message}</h1>
    </div>
  );
}

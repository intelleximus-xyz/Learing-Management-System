'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user?.role === 'STUDENT') {
        router.push('/dashboard/student');
      } else if (user?.role === 'TEACHER') {
        router.push('/dashboard/teacher');
      } else if (user?.role === 'ADMIN') {
        router.push('/dashboard/admin');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Learning Management System</h1>
        <p style={{ fontSize: '1.2rem' }}>Redirecting...</p>
      </div>
    </div>
  );
}

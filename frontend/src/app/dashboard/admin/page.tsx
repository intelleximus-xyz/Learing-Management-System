'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import api from '@/lib/api';
import { Course } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(currentUser);
    loadCourses();
  }, [router]);

  const loadCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ 
        background: '#667eea', 
        color: 'white', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '1.5rem' }}>LMS - Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}</span>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'white', 
              color: '#667eea', 
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>All Courses</h2>
        
        {courses.length === 0 ? (
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p>No courses in the system yet.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {courses.map((course) => (
              <div 
                key={course.id}
                style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ marginBottom: '0.5rem', color: '#667eea' }}>{course.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  {course.code}
                </p>
                <p style={{ marginBottom: '1rem' }}>{course.description}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Teacher: {course.teacher?.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

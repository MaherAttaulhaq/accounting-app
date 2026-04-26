'use client';

const API_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return res.json();
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Signup failed');
  }
  
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  return res.json();
}

export async function getSession() {
  const res = await fetch(`${API_URL}/api/auth/session`, {
    credentials: 'include',
  });
  return res.json();
}
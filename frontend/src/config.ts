const isProd = typeof window !== 'undefined' ? !window.location.hostname.includes('localhost') : process.env.NODE_ENV === 'production';
const rawUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? '' : 'http://localhost:8080');

if (typeof window !== 'undefined') {
  console.log('🌐 [CONFIG] SuppliMax API Base URL:', rawUrl || 'MISSING API URL!');
}

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');

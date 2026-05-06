const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const isProd = isVercel || process.env.NODE_ENV === 'production';

// Force the URL from env, or fallback ONLY if not on Vercel/Production
const rawUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://supplimax-gym.vercel.app' : 'http://localhost:8080');

if (typeof window !== 'undefined') {
  console.log('🌐 [CONFIG] SuppliMax API Base URL:', rawUrl);
}

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');

const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const isProd = isVercel || process.env.NODE_ENV === 'production';

// Force the URL from env, with no hardcoded production fallback
const rawUrl = process.env.NEXT_PUBLIC_API_URL || '';

if (typeof window !== 'undefined') {
  console.log('🌐 [CONFIG] SuppliMax API Base URL:', rawUrl);
}

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');

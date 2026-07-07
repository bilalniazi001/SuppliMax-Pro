// Force the URL from env, or fallback to production Vercel URL
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://supplimax-gym.vercel.app';

if (typeof window !== 'undefined') {
  console.log('🌐 [CONFIG] SuppliMax API Base URL:', rawUrl);
}

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');

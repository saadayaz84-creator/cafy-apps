import { Platform } from './types';

export const PLATFORMS: { value: Platform; label: string; placeholder: string }[] = [
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
  { value: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/username' },
];

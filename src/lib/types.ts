export interface AuditFormData {
  name: string;
  email: string;
  platform: Platform;
  profile_url: string;
  niche: string;
  content_goal: string;
  frustration: string;
  submitted_at: string;
}

export type Platform =
  | 'linkedin'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'facebook'
  | 'twitter';

export interface WebhookResponse {
  success: boolean;
  message: string;
}

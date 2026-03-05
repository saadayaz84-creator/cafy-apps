import { AuditFormData, WebhookResponse } from './types';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_AUDIT_WEBHOOK;

export async function submitAudit(data: AuditFormData): Promise<WebhookResponse> {
  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL is not configured');
  }

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Submission failed: ${res.status}`);
  }

  return res.json();
}

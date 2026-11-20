import { getSiteBaseUrl } from '../config';

// Excludes O, 0, I, 1 to eliminate visual ambiguity
const SAFE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateProcessCode(): string {
  let code = '';
  const values = new Uint32Array(6);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(values);
    for (let i = 0; i < 6; i += 1) {
      code += SAFE_CHARS[values[i] % SAFE_CHARS.length];
    }
  } else {
    for (let i = 0; i < 6; i += 1) {
      code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
    }
  }
  return `PY-${code}`;
}

export function buildClientTrackingMessage(code: string): string {
  const baseUrl = getSiteBaseUrl() || 'https://seusite.com';
  return `Seu código de acompanhamento é ${code}. Acompanhe em ${baseUrl}/acompanhar`;
}

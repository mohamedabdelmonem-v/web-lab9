export const VALID_GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];

export function validatePositiveIntId(rawId) {
  if (!/^\d+$/.test(String(rawId))) return null;
  const num = Number(rawId);
  return Number.isSafeInteger(num) && num > 0 ? num : null;
}

export function validateBookPayload(body, isPatch = false, existingBook = null) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object.' };
  }
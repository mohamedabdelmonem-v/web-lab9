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

  const currentYear = new Date().getFullYear();

  const titleRaw = isPatch && body.title === undefined ? existingBook.title : body.title;
  const authorRaw = isPatch && body.author === undefined ? existingBook.author : body.author;
  const yearRaw = isPatch && body.year === undefined ? existingBook.year : body.year;
  const genreRaw = isPatch && body.genre === undefined ? existingBook.genre : body.genre;
  const readRaw = isPatch && body.read === undefined ? existingBook.read : (body.read ?? false);
  const ratingRaw = isPatch && body.rating === undefined ? existingBook.rating : (body.rating ?? null);

  if (typeof titleRaw !== 'string' || titleRaw.trim().length < 1 || titleRaw.trim().length > 100) {
    return { error: 'Title must be a string between 1 and 100 characters after trimming.' };
  }
  if (typeof authorRaw !== 'string' || authorRaw.trim().length < 1 || authorRaw.trim().length > 100) {
    return { error: 'Author must be a string between 1 and 100 characters after trimming.' };
  }
  if (typeof yearRaw !== 'number' || !Number.isInteger(yearRaw) || yearRaw < 1000 || yearRaw > currentYear) {
    return { error: `Year must be an integer between 1000 and ${currentYear}.` };
  }
  if (!VALID_GENRES.includes(genreRaw)) {
    return { error: `Genre must be one of: ${VALID_GENRES.join(', ')}.` };
  }
  if (typeof readRaw !== 'boolean') {
    return { error: 'Read status must be a boolean.' };
  }
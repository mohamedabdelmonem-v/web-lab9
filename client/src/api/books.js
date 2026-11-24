const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(endpoint, { method = 'GET', body, signal } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export function fetchBooks(filters = {}, signal) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  const queryString = params.toString();
  const path = queryString ? `/api/books?${queryString}` : '/api/books';
  return request(path, { signal });
}

export function fetchStats(signal) {
  return request('/api/stats', { signal });
}

export function createBook(bookData) {
  return request('/api/books', { method: 'POST', body: bookData });
}

export function replaceBook(id, bookData) {
  return request(`/api/books/${id}`, { method: 'PUT', body: bookData });
}
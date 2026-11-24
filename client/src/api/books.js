const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(endpoint, { method = 'GET', body, signal } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
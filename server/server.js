import express from 'express';
import cors from 'cors';
import { VALID_GENRES, validatePositiveIntId, validateBookPayload } from './validate.js';
import {
  getAllBooks,
  getBookById,
  isDuplicateBook,
  createBook,
  replaceBook,
  deleteBook
} from './booksStore.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Restricted CORS & JSON parser before routes
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Handle malformed JSON syntax errors cleanly
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON in request body.' });
  }
  next(err);
});

// GET /api/books with filtering, sorting, and pagination
app.get('/api/books', async (req, res) => {
  const allowedParams = ['genre', 'read', 'q', 'sort', 'order', 'limit', 'page'];
  for (const [key, val] of Object.entries(req.query)) {
    if (Array.isArray(val)) {
      return res.status(400).json({ error: `Repeated query parameter: ${key}` });
    }
    if (!allowedParams.includes(key)) {
      return res.status(400).json({ error: `Unknown query parameter: ${key}` });
    }
  }

  const { genre, read, q, sort = 'id', order = 'asc', limit = '50', page = '1' } = req.query;

  if (genre !== undefined && !VALID_GENRES.includes(genre)) {
    return res.status(400).json({ error: 'Invalid genre filter.' });
  }
  if (read !== undefined && read !== 'true' && read !== 'false') {
    return res.status(400).json({ error: 'Read filter must be true or false.' });
  }
  if (!['id', 'title', 'author', 'year', 'rating'].includes(sort)) {
    return res.status(400).json({ error: 'Invalid sort field.' });
  }
  if (!['asc', 'desc'].includes(order)) {
    return res.status(400).json({ error: 'Order must be asc or desc.' });
  }
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
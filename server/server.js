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

  const limitNum = Number(limit);
  const pageNum = Number(page);
  if (!/^\d+$/.test(String(limit)) || limitNum < 1 || limitNum > 50) {
    return res.status(400).json({ error: 'Limit must be an integer between 1 and 50.' });
  }
  if (!/^\d+$/.test(String(page)) || pageNum < 1) {
    return res.status(400).json({ error: 'Page must be a positive integer.' });
  }

  let results = await getAllBooks();

  if (genre) {
    results = results.filter((b) => b.genre === genre);
  }
  if (read !== undefined) {
    const readBool = read === 'true';
    results = results.filter((b) => b.read === readBool);
  }
  if (q && q.trim() !== '') {
    const term = q.trim().toLowerCase();
    results = results.filter(
      (b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
  }

  // Sort a shallow copy
  const sorted = [...results].sort((a, b) => {
    if (sort === 'rating') {
      if (a.rating === null && b.rating === null) return 0;
      if (a.rating === null) return 1; // Unrated books always sort last
      if (b.rating === null) return -1;
      return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    if (sort === 'title' || sort === 'author') {
      const cmp = a[sort].localeCompare(b[sort]);
      return order === 'asc' ? cmp : -cmp;
    }
    const diff = a[sort] - b[sort];
    return order === 'asc' ? diff : -diff;
  });

  const startIndex = (pageNum - 1) * limitNum;
  const paginated = sorted.slice(startIndex, startIndex + limitNum);

  res.status(200).json(paginated);
});

// GET /api/books/:id
app.get('/api/books/:id', async (req, res) => {
  const id = validatePositiveIntId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Book ID must be a positive integer.' });

  const book = await getBookById(id);
  if (!book) return res.status(404).json({ error: 'Book not found.' });

  res.status(200).json(book);
});

// POST /api/books
app.post('/api/books', async (req, res) => {
  const { error, data } = validateBookPayload(req.body, false);
  if (error) return res.status(400).json({ error });

  if (await isDuplicateBook(data.title, data.author)) {
    return res.status(409).json({ error: 'A book with the same title and author already exists.' });
  }

  const created = await createBook(data);
  res.status(201).location(`/api/books/${created.id}`).json(created);
});

// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
  const id = validatePositiveIntId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Book ID must be a positive integer.' });

  const existing = await getBookById(id);
  if (!existing) return res.status(404).json({ error: 'Book not found.' });

  const { error, data } = validateBookPayload(req.body, false);
  if (error) return res.status(400).json({ error });

  if (await isDuplicateBook(data.title, data.author, id)) {
    return res.status(409).json({ error: 'Another book with the same title and author already exists.' });
  }

  const updated = await replaceBook(id, data);
  res.status(200).json(updated);
});
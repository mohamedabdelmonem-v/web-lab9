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
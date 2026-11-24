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
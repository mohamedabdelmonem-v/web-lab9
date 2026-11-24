import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchBooks,
  fetchStats,
  createBook,
  replaceBook,
  patchBook,
  deleteBook
} from './api/books';
import StatsPanel from './components/StatsPanel';
import BookForm from './components/BookForm';
import BookItem from './components/BookItem';

const GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Server query filter states
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('asc');

  const loadStats = useCallback(async (signal) => {
    try {
      const statsData = await fetchStats(signal);
      setStats(statsData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Stats load failed:', err);
      }
    }
  }, []);

  // Fetch filtered/sorted books from server with AbortController cleanup
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchBooks({ q, genre, read: readFilter, sort, order }, controller.signal)
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [q, genre, readFilter, sort, order]);

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal);
    return () => controller.abort();
  }, [loadStats]);

  const refreshData = async () => {
    const [freshBooks, freshStats] = await Promise.all([
      fetchBooks({ q, genre, read: readFilter, sort, order }),
      fetchStats()
    ]);
    setBooks(freshBooks);
    setStats(freshStats);
  };

  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    setActionError('');
    try {
      if (editingBook) {
        await replaceBook(editingBook.id, payload);
        setEditingBook(null);
      } else {
        await createBook(payload);
      }
      await refreshData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleRead = async (book) => {
    setIsSubmitting(true);
    setActionError('');
    try {
      const nextRead = !book.read;
      await patchBook(book.id, {
        read: nextRead,
        rating: nextRead ? book.rating : null
      });
      await refreshData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRate = async (id, rating) => {
    setIsSubmitting(true);
    setActionError('');
    try {
      await patchBook(id, { rating });
      await refreshData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    setActionError('');
    try {
      await deleteBook(id);
      if (editingBook?.id === id) setEditingBook(null);
      await refreshData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Reading List Manager</h1>

      <StatsPanel stats={stats} />

      {actionError && (
        <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '15px' }}>
          <strong>Error:</strong> {actionError}
        </div>
      )}

      <BookForm
        editingBook={editingBook}
        onSubmit={handleFormSubmit}
        onCancelEdit={() => setEditingBook(null)}
        isSubmitting={isSubmitting}
      />

      {/* Search, Filter & Sort Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search title or author..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id">Sort: ID</option>
          <option value="title">Sort: Title</option>
          <option value="author">Sort: Author</option>
          <option value="year">Sort: Year</option>
          <option value="rating">Sort: Rating</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Book List States */}
      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: 'red' }}>Failed to load books: {error}</p>}
      {!loading && !error && books.length === 0 && <p>No books found matching your filters.</p>}

      {!loading && !error && books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onEdit={setEditingBook}
          onToggleRead={handleToggleRead}
          onRate={handleRate}
          onDelete={handleDelete}
          busy={isSubmitting}
        />
      ))}
    </div>
  );
}
import React, { useState, useEffect } from 'react';

const GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];

export default function BookForm({ editingBook, onSubmit, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(2024);
  const [genre, setGenre] = useState('fiction');
  const [read, setRead] = useState(false);
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setYear(editingBook.year);
      setGenre(editingBook.genre);
      setRead(editingBook.read);
      setRating(editingBook.rating ?? '');
    } else {
      setTitle('');
      setAuthor('');
      setYear(2024);
      setGenre('fiction');
      setRead(false);
      setRating('');
    }
  }, [editingBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      author,
      year: Number(year),
      genre,
      read,
      rating: read && rating !== '' ? Number(rating) : null
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '20px' }}>
      <h3>{editingBook ? `Edit Book #${editingBook.id}` : 'Add New Book'}</h3>
      <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={read}
            onChange={(e) => {
              setRead(e.target.checked);
              if (!e.target.checked) setRating('');
            }}
          />
          Read
        </label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} disabled={!read}>
          <option value="">No Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} ★</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : editingBook ? 'Update Book (PUT)' : 'Add Book (POST)'}
        </button>
        {editingBook && (
          <button type="button" onClick={onCancelEdit} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
import React from 'react';

export default function BookItem({ book, onEdit, onToggleRead, onRate, onDelete, busy }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
      <div>
        <strong>{book.title}</strong> by {book.author} ({book.year}) — <em>{book.genre}</em>
        <div style={{ fontSize: '14px', marginTop: '4px' }}>
          Status: <strong>{book.read ? 'Read' : 'Unread'}</strong> | Rating:{' '}
          <strong>{book.rating ? `${book.rating}/5 ★` : 'Unrated'}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button disabled={busy} onClick={() => onToggleRead(book)}>
          {book.read ? 'Mark Unread' : 'Mark Read'}
        </button>

        {book.read && (
          <select
            disabled={busy}
            value={book.rating ?? ''}
            onChange={(e) => onRate(book.id, e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">Rate...</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} ★</option>
            ))}
          </select>
        )}

        <button disabled={busy} onClick={() => onEdit(book)}>Edit</button>
        <button disabled={busy} onClick={() => onDelete(book.id)}>Delete</button>
      </div>
    </div>
  );
}
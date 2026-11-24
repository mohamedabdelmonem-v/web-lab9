import React from 'react';

export default function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <section style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '20px', background: '#f9fafb' }}>
      <h3>Library Statistics</h3>
      <p>
        <strong>Total:</strong> {stats.total} | <strong>Read:</strong> {stats.read} |{' '}
        <strong>Unread:</strong> {stats.unread} |{' '}
        <strong>Avg Rating:</strong> {stats.averageRating ?? 'N/A'}
      </p>
      <p style={{ marginTop: '6px', fontSize: '14px' }}>
        <strong>By Genre:</strong>{' '}
        {Object.entries(stats.byGenre).map(([g, count]) => `${g} (${count})`).join(', ') || 'None'}
      </p>
    </section>
  );
}
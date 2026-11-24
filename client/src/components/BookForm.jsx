import React, { useState, useEffect } from 'react';

const GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];

export default function BookForm({ editingBook, onSubmit, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(2024);
  const [genre, setGenre] = useState('fiction');
  const [read, setRead] = useState(false);
  const [rating, setRating] = useState('');
const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

let books = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965, genre: 'science', read: true, rating: 5 },
  { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, genre: 'fantasy', read: true, rating: 5 },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', year: 2011, genre: 'history', read: true, rating: 4 },
  { id: 4, title: '1984', author: 'George Orwell', year: 1949, genre: 'fiction', read: false, rating: null },
  { id: 5, title: 'Clean Code', author: 'Robert C. Martin', year: 2008, genre: 'non-fiction', read: true, rating: 4 },
  { id: 6, title: 'The Name of the Wind', author: 'Patrick Rothfuss', year: 2007, genre: 'fantasy', read: false, rating: null }
];
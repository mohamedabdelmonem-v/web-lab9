# web-lab9
build a  full-stack application: a REST API written with Node.js and Express, and a React front-end that uses it.
# Full-Stack Reading List Application (Assignment 9)

## How to Install and Run
### 1. Server
1. Navigate to `server/` and run `npm install`.
2. Environment variables (optional): `PORT` (defaults to `3000`) and `CLIENT_ORIGIN` (defaults to `http://localhost:5173`).
3. Run `npm run dev` (auto-reload via `node --watch`) or `npm start`.

### 2. Client
1. Navigate to `client/` and run `npm install`.
2. Copy `client/.env.example` to `client/.env` (`VITE_API_URL=http://localhost:3000`).
3. Run `npm run dev` and open `http://localhost:5173`.

## File Organization
- `server/server.js`: Express 5 REST API, restricted CORS configuration, query filtering/sorting, 404 fallback, and central error middleware.
- `server/booksStore.js`: Async in-memory data store with immutable state updates and initial seed books.
- `server/validate.js`: Custom validation helpers for positive integer IDs and book payloads.
- `client/src/api/books.js`: Dedicated Fetch API client module handling headers, `AbortSignal`, 204 responses, and API errors.
- `client/src/components/StatsPanel.jsx`: Displays live aggregate library statistics.
- `client/src/components/BookForm.jsx`: Controlled form supporting both creating (`POST`) and replacing (`PUT`) books.
- `client/src/components/BookItem.jsx`: Displays individual book details with `PATCH` (read toggle/rating) and `DELETE` actions.
- `client/src/App.jsx`: Main application coordinating query parameters, `AbortController` fetches, and server-confirmed UI updates.

## Testing Evidence (Section 7)
### curl --include Outputs (10 Requests)
*(Run `curl.exe --include` against your running server for the 10 required scenarios and paste the full status lines, headers, and bodies here)*

### Browser Network Tab — OPTIONS Preflight Evidence
When the React client on `http://localhost:5173` sends a `POST`, `PUT`, `PATCH`, or `DELETE` request with `Content-Type: application/json` to `http://localhost:3000`, the browser first dispatches an HTTP `OPTIONS` preflight request to `/api/books`. In the DevTools Network tab, the server responds with status `204 No Content` and the headers `Access-Control-Allow-Origin: http://localhost:5173`, `Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE`, and `Access-Control-Allow-Headers: Content-Type`.

## Reasoning Questions (Section 8)
1. **Parameters**: A book's `id` identifies a specific unique resource in the REST hierarchy (`/api/books/:id`), whereas `genre` and `sort` are optional modifiers that filter or order a collection. Putting `id` in the query string would blur resource identity with collection filtering and break standard REST semantics for `PUT`, `PATCH`, and `DELETE` on a single entity.
2. **Body Parsing**: Moving `app.use(express.json())` below the routes leaves `req.body` as `undefined` when `POST /api/books` executes. Consequently, our payload validation immediately rejects the missing object and returns HTTP `400 Bad Request` (`{ "error": "Request body must be a JSON object." }`).
3. **One Response**: Removing `return` before an early `res.status(404).json(...)` allows JavaScript execution to continue down into the rest of the route handler and attempt a second response (`res.status(200).json(...)`). Express then throws an `ERR_HTTP_HEADERS_SENT` error (`Cannot set headers after they are sent to the client`) because an HTTP response can only be sent once.
4. **PUT vs. PATCH**: `PATCH /api/books/:id` is ideal when toggling a book's `read` checkbox or updating its `rating` alone, because only the modified field needs to be transmitted. `PUT /api/books/:id` is better when submitting the full edit form where the user replaces the entire book record (`title`, `author`, `year`, `genre`, `read`, `rating`) at once.
5. **CORS**: Setting `CLIENT_ORIGIN` to a wrong origin (e.g., `http://localhost:9999`) causes the browser console to block the response with a CORS policy error (`Access-Control-Allow-Origin` mismatch). The server still receives and processes the request (since CORS is enforced by browsers, not the server), which is also why `curl` continues to work unaffected.
6. **Validation**: Client-side validation improves user experience but can be easily bypassed using `curl`, Postman, or browser DevTools. The server must independently validate all incoming data to protect data integrity and enforce business rules (such as preventing duplicate books or rating unread books).
7. **State**: Restarting the server resets all added, edited, or deleted books back to the initial 6 seed books. This proves the data lives solely in volatile RAM inside the Node.js process; persisting data across restarts requires an external database (e.g., PostgreSQL, SQLite, or MongoDB) or file storage.

## Self-Study Notes
- **URLSearchParams**: Researched MDN documentation for `URLSearchParams` to safely encode spaces and special characters in search queries (`q`) without manual string concatenation.
- **Alphabetical Sorting (`localeCompare`)**: Used `String.prototype.localeCompare()` when sorting by `title` or `author` to handle case-insensitive alphabetical ordering accurately across strings.
- **Vite Environment Variables (`import.meta.env`)**: Learned that Vite only exposes variables prefixed with `VITE_` (such as `VITE_API_URL`) to client bundle code via `import.meta.env` to prevent accidentally leaking server-side secrets.
- **Empty 204 Responses in Express 5**: Used `res.status(204).end()` for `DELETE /api/books/:id` so Express sends the `204 No Content` status header with zero body bytes.
- **Fetch Cancellation (`AbortController`)**: Passed `controller.signal` into `fetch()` inside `useEffect` cleanup and ignored `err.name === 'AbortError'` in `.catch()` so rapid filter changes never cause stale responses to overwrite newer results.

## Challenges Faced
1. **Cross-Field Validation in `PATCH`**: Merging partial updates with existing book properties before running full validation so that setting `read: false` on a previously rated book properly enforces the rule that unread books cannot keep a rating.
2. **Preventing Stale Race Conditions**: Coordinating `AbortController` cleanup in `App.jsx` when typing rapidly in the search box so earlier slow responses do not overwrite the latest search results.
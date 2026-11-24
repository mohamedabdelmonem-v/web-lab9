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


 curl.exe --include "http://localhost:3000/api/books?genre=fantasy&sort=year"
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 235
ETag: W/"eb-scnLoqb2pGcMcJw6K8397h3XlPI"
Date: Tue, 24 Nov 2026 21:08:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":2,"title":"The Hobbit","author":"J.R.R. Tolkien","year":1937,"genre":"fantasy","read":true,"rating":5},{"id":6,"title":"The Name of the Wind","author":"Patrick Rothfuss","year":2007,"genre":"fantasy","read":false,"rating":null}]







 curl.exe --include "http://localhost:3000/api/books/1"
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 101
ETag: W/"65-imtguC0biqtv8FVKP54vGf/dVoY"
Date: Tue, 24 Nov 2026 21:08:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"title":"Dune","author":"Frank Herbert","year":1965,"genre":"science","read":true,"rating":5}
PS C:\Users\mooevvv\OneDrive\Desktop\current courses\web progremming\web-labs\web-lab9> curl.exe --include -X POST "http://localhost:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"Foundation\",\"author\":\"Isaac Asimov\",\"year\":1951,\"genre\":\"science\",\"read\":true,\"rating\":5}"
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-2YCDZucXE/S7RJixCHA65iG3qQs"
Date: Tue, 24 Nov 2026 21:08:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Malformed JSON in request body."}curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535
curl: (3) unmatched close brace/bracket in position 61:
Asimov\,\year\:1951,\genre\:\science\,\read\:true,\rating\:5}
                                                            ^





 curl.exe --include -X POST "http://localhost:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"Invalid Book\",\"author\":\"Test Author\",\"year\":2020,\"genre\":\"fiction\",\"read\":false,\"rating\":4}"
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-2YCDZucXE/S7RJixCHA65iG3qQs"
Date: Tue, 24 Nov 2026 21:08:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Malformed JSON in request body."}curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535
curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535
curl: (3) unmatched close brace/bracket in position 62:
Author\,\year\:2020,\genre\:\fiction\,\read\:false,\rating\:4}
                                                             ^





 curl.exe --include "http://localhost:3000/api/books?genre=fiction&genre=history"
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-KbQSL0nV4gn4Jssr/vMGu9RuLK4"
Date: Tue, 24 Nov 2026 21:08:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Repeated query parameter: genre"}






 curl.exe --include "http://localhost:3000/api/books/999"
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 27
ETag: W/"1b-z2XdT0RBVuOwsYq0WL+e3NUScIM"
Date: Tue, 24 Nov 2026 21:09:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Book not found."}






 curl.exe --include -X POST "http://localhost:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"Dune\",\"author\":\"Frank Herbert\",\"year\":1965,\"genre\":\"science\",\"read\":true,\"rating\":5}"
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-2YCDZucXE/S7RJixCHA65iG3qQs"
Date: Tue, 24 Nov 2026 21:09:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Malformed JSON in request body."}curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535
curl: (3) unmatched close brace/bracket in position 62:
Herbert\,\year\:1965,\genre\:\science\,\read\:true,\rating\:5}
                                                             ^





 curl.exe --include -X PUT "http://localhost:3000/api/books/4" -H "Content-Type: application/json" -d "{\"title\":\"1984\",\"author\":\"George Orwell\",\"year\":1949,\"genre\":\"fiction\",\"read\":false,\"rating\":null}"
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-2YCDZucXE/S7RJixCHA65iG3qQs"
Date: Tue, 24 Nov 2026 21:09:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Malformed JSON in request body."}curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535
curl: (3) unmatched close brace/bracket in position 65:
Orwell\,\year\:1949,\genre\:\fiction\,\read\:false,\rating\:null}
                                                                ^





 curl.exe --include -X PATCH "http://localhost:3000/api/books/4" -H "Content-Type: application/json" -d "{\"read\":true,\"rating\":5}"
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-2YCDZucXE/S7RJixCHA65iG3qQs"
Date: Tue, 24 Nov 2026 21:09:23 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Malformed JSON in request body."}curl: (3) unmatched close brace/bracket in position 22:
read\:true,\rating\:5}
                     ^






 curl.exe --include -X DELETE "http://localhost:3000/api/books/6"
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Date: Tue, 24 Nov 2026 21:09:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5




 curl.exe --include -X DELETE "http://localhost:3000/api/books/6"
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 27
ETag: W/"1b-z2XdT0RBVuOwsYq0WL+e3NUScIM"
Date: Tue, 24 Nov 2026 21:09:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Book not found."}




curl.exe --include "http://localhost:3000/api/stats"

HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 127
ETag: W/"7f-xQ6v/oCM6mOak3TTHhLFV8qrjMQ"
Date: Tue, 24 Nov 2026 21:09:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"total":5,"read":4,"unread":1,"averageRating":4.5,"byGenre":{"science":1,"fantasy":1,"history":1,"fiction":1,"non-fiction":1}}




 curl.exe --include -X DELETE "http://localhost:3000/api/books/5"
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Date: Tue, 24 Nov 2026 21:09:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5




 curl.exe --include "http://localhost:3000/api/stats"

HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-B8JaaMxll7hNz5ipiMkaR6DDelg"
Date: Tue, 24 Nov 2026 21:10:04 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"total":4,"read":3,"unread":1,"averageRating":4.67,"byGenre":{"science":1,"fantasy":1,"history":1,"fiction":1}}


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
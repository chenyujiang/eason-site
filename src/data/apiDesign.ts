import type { NoteSection } from './notes'

export const apiDesignIntro =
  'An API is a contract between the people who build a service and the people who call it. Good ones are ==consistent, simple, secure, and efficient==, and they keep working for old clients while the service underneath keeps changing.'

export const apiDesignSections: NoteSection[] = [
  {
    id: 'contracts',
    title: 'APIs are contracts',
    blocks: [
      {
        kind: 'p',
        text: 'An API defines which requests a client may send and what comes back. It hides the implementation and exposes capabilities, and it draws service boundaries: the user service and the post service each own their own surface.',
      },
      {
        kind: 'p',
        text: 'Think of a wall socket. Once it is in every house, ==its shape cannot change==. The wiring behind the wall can be replaced at will.',
      },
      {
        kind: 'table',
        caption: 'Three mainstream styles',
        head: ['Style', 'How it works', 'Good for'],
        rows: [
          ['REST', 'Resources addressed by URL, acted on with HTTP methods; stateless', 'Public APIs, web and mobile clients'],
          ['GraphQL', 'One endpoint; the client declares the fields it wants', 'Rich UIs with nested data'],
          ['gRPC', 'HTTP/2 + Protocol Buffers; strongly typed, supports streaming', 'Service-to-service calls'],
        ],
      },
      {
        kind: 'defs',
        items: [
          { term: 'Consistent', text: 'One naming scheme, one casing, one pattern. Not `userDetails` here and `user-details` there.' },
          { term: 'Simple', text: 'Focus on the core use cases. The best APIs are usable without reading the docs.' },
          { term: 'Secure', text: 'Authentication, authorisation, input validation, and rate limiting are the floor, not extras.' },
          { term: 'Efficient', text: 'Cache, paginate, trim payloads, and cut round trips.' },
        ],
      },
      {
        kind: 'callout',
        label: 'No surprises',
        text: 'A `GET /users/123` that quietly updates followers is a bad API. Callers never expect a read to ==have side effects==.',
      },
      {
        kind: 'p',
        text: 'Design resource-first: settle the resources, then how they relate, then their fields, and only then the methods. Reach for a custom method only when the standard Get / List / Create / Update / Delete set cannot express the action.',
      },
    ],
  },
  {
    id: 'protocols',
    title: 'Protocols and transport',
    blocks: [
      {
        kind: 'p',
        text: 'The wrong protocol caps performance and features. Default to HTTPS; add the others only when a use case demands them.',
      },
      {
        kind: 'table',
        caption: 'Picking a protocol',
        head: ['Protocol', 'Traits', 'Typical use'],
        rows: [
          ['HTTPS', 'Request / response; methods, status codes, and headers map naturally to REST', 'Almost every API'],
          ['WebSocket', 'One handshake, then a long-lived two-way connection; the server can push', 'Chat, live collaboration, market data'],
          ['AMQP', 'Producer, broker queue, consumer; guaranteed delivery', 'Order processing, background jobs, absorbing spikes'],
          ['gRPC', 'Binary protobuf over HTTP/2, typed contracts, streaming', 'Internal microservices'],
        ],
      },
      {
        kind: 'defs',
        items: [
          { term: 'TCP', text: 'Registered post. Three-way handshake, ==guaranteed delivery and order==, lost packets resent. Costs overhead; use it for payments, auth, user data.' },
          { term: 'UDP', text: 'A postcard. No connection, no handshake, no redelivery. Faster and lighter; use it for video calls, live streams, games.' },
        ],
      },
      {
        kind: 'p',
        text: 'Browsers speak HTTP/2 but do not expose the low-level features gRPC relies on, so browser clients need gRPC-Web behind a proxy.',
      },
    ],
  },
  {
    id: 'resources',
    title: 'REST resources and URLs',
    blocks: [
      {
        kind: 'p',
        text: 'Model the business domain as ==nouns== and leave the verbs to HTTP methods.',
      },
      {
        kind: 'code',
        label: 'Collection, item, nested',
        code: 'GET /api/v1/products\nGET /api/v1/products/123\nGET /api/v1/products/123/reviews',
      },
      {
        kind: 'table',
        caption: 'Naming',
        head: ['Avoid', 'Prefer'],
        rows: [
          ['GET /getProducts', 'GET /products'],
          ['POST /users/123/delete', 'DELETE /users/123'],
          ['/Product_List', '/product-lists'],
        ],
      },
      {
        kind: 'list',
        items: [
          'Paths are ==plural, lowercase, hyphenated==.',
          'Nest at most about two levels. `/users/123/orders` is fine; `/users/123/orders/9/items/4/notes` is not.',
          'When an action really is a verb, a custom method such as `POST /orders/123:cancel` is clearer than bending a standard one. Check first that a standard method cannot say it.',
        ],
      },
    ],
  },
  {
    id: 'pagination',
    title: 'Filtering, sorting, pagination',
    blocks: [
      {
        kind: 'p',
        text: 'Real endpoints rarely return everything at once. Filtering, sorting, and paging are query parameters, and they ==run on the server==. Never ship a thousand rows for the client to sort.',
      },
      {
        kind: 'code',
        label: 'Query parameters',
        code: 'GET /api/v1/products?category=electronics&inStock=true\nGET /api/v1/products?sort=price_asc\nGET /api/v1/products?page=2&limit=10\nGET /api/v1/products?cursor=eyJpZCI6MTIzfQ&limit=10',
      },
      {
        kind: 'table',
        caption: 'Offset vs cursor',
        head: ['Approach', 'Strengths', 'Weaknesses', 'Fits'],
        rows: [
          ['Offset / page', 'Simple; can jump to page N', 'Slows down deep in the set; inserts and deletes cause duplicates or gaps', 'Admin tables, small data'],
          ['Cursor', 'Remembers where you stopped; stable speed, no duplicates or gaps', 'Cannot jump to an arbitrary page', 'Feeds, infinite scroll, large tables'],
        ],
      },
      {
        kind: 'p',
        text: 'Keep the cursor ==opaque to the client== (for example base64 of `{"id":123}`) so the server can change how it works. Return a `next_cursor`; empty means the last page.',
      },
      {
        kind: 'callout',
        label: 'Always cap limit',
        text: 'Without a maximum (say 100), one request can drain a whole table. ==Unbounded resource use== is a security problem, not just a performance one.',
      },
    ],
  },
  {
    id: 'idempotency',
    title: 'Methods and idempotency',
    blocks: [
      {
        kind: 'p',
        text: 'A request is ==idempotent== when sending it once or N times leaves the server in the same state. After a timeout, a client can only retry safely if the request is idempotent.',
      },
      {
        kind: 'table',
        caption: 'HTTP methods',
        head: ['Method', 'Does', 'Safe', 'Idempotent'],
        rows: [
          ['GET', 'Read', 'Yes', 'Yes'],
          ['POST', 'Create', 'No', 'No — a new ID each time'],
          ['PUT', 'Replace whole resource', 'No', 'Yes'],
          ['PATCH', 'Partial update', 'No', 'Not guaranteed'],
          ['DELETE', 'Remove', 'No', 'Yes'],
        ],
      },
      {
        kind: 'p',
        text: 'Placing an order or charging a card is a `POST`, so a blind retry can charge twice. The fix is an ==idempotency key==: a unique value the client generates and sends with the request, so the server can recognise retries of the same operation.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'First call: `POST /charges` with `Idempotency-Key: 7f3c…`. The charge succeeds and the server stores the status code and body.',
          'The response is lost on the way back. The client cannot tell whether it worked.',
          'Retry with the same key. The server returns the stored result and ==does not charge again==.',
          'Same key, different amount: the server rejects it as misuse.',
        ],
      },
      {
        kind: 'code',
        label: 'Server side (pseudocode)',
        code: 'const saved = await store.get(key)\nif (saved) {\n  if (saved.hash !== hash(body)) return error(422, "key reused with different parameters")\n  return saved.response // retry: replay the first result\n}\nconst response = await createCharge(body)\nawait store.set(key, { hash: hash(body), response }, { ttl: "24h" })\nreturn response',
      },
      {
        kind: 'defs',
        items: [
          { term: 'Key', text: 'Client-generated, ideally a v4 UUID.' },
          { term: 'Stored result', text: 'The first status code and body, ==including failures==, so every retry sees the same outcome.' },
          { term: 'Retention', text: 'Keep keys for at least 24 hours before purging.' },
          { term: 'Scope', text: 'Only matters for POST; GET and DELETE are idempotent already.' },
        ],
      },
      {
        kind: 'callout',
        label: 'Race condition',
        text: 'Two retries can arrive together and both miss the lookup. In production, use a ==unique constraint or a lock== so only one request per key runs.',
      },
    ],
  },
  {
    id: 'errors',
    title: 'Status codes and errors',
    blocks: [
      {
        kind: 'table',
        caption: 'Status codes worth knowing',
        head: ['Code', 'Meaning', 'Use when'],
        rows: [
          ['200 OK', 'Success', 'A GET succeeded'],
          ['201 Created', 'Created', 'A POST created something — not 200'],
          ['202 Accepted', 'Queued for later', 'Async jobs: reports, transcoding'],
          ['204 No Content', 'Success, empty body', 'A delete succeeded'],
          ['400 Bad Request', 'Malformed request', 'Invalid parameters, broken JSON'],
          ['401 Unauthorized', 'Not authenticated', '“Who are you?” — no token, or a bad one'],
          ['403 Forbidden', 'Not allowed', '“I know who you are, and no.”'],
          ['404 Not Found', 'Missing', 'No such ID'],
          ['409 Conflict', 'State conflict', 'Duplicate create, version clash'],
          ['422 Unprocessable', 'Well-formed but invalid', 'Field validation failed'],
          ['429 Too Many Requests', 'Rate limited', 'Pair with a Retry-After header'],
          ['500 / 503', 'Server error / unavailable', 'The client did nothing wrong'],
        ],
      },
      {
        kind: 'p',
        text: 'If every endpoint invents its own error shape, every client writes N parsers. ==RFC 9457 Problem Details== is the standard shape, served as `application/problem+json`.',
      },
      {
        kind: 'code',
        label: '422 with problem details',
        code: '{\n  "type": "https://api.example.com/problems/invalid-field",\n  "title": "Validation failed",\n  "status": 422,\n  "detail": "email is not a valid address",\n  "instance": "/users/signup/req-8f2a",\n  "errors": [{ "field": "email", "code": "invalid_format" }]\n}',
      },
      {
        kind: 'defs',
        items: [
          { term: 'type', text: 'A URI naming the error kind. Clients branch on it.' },
          { term: 'title', text: 'Short human-readable summary of that kind.' },
          { term: 'status', text: 'The HTTP status code.' },
          { term: 'detail', text: 'What went wrong this time.' },
          { term: 'instance', text: 'An identifier for this occurrence, for finding it in logs.' },
        ],
      },
      {
        kind: 'p',
        text: 'Extension fields like `errors` are allowed. What matters is ==a machine-readable code, a human-readable message, and the offending field==, in one shape across the whole API. Never return stack traces or raw SQL errors.',
      },
    ],
  },
  {
    id: 'versioning',
    title: 'Versioning and compatibility',
    blocks: [
      {
        kind: 'p',
        text: 'Put the major version in the URL (`/api/v1`). A breaking change ships as `v2`; old clients stay on `v1` and users never notice. Neither side may break the contract unilaterally.',
      },
      {
        kind: 'table',
        caption: 'What needs a new version',
        head: ['Change', 'Compatible?'],
        rows: [
          ['Add an optional field', 'Yes'],
          ['Add an endpoint', 'Yes'],
          ['Relax validation', 'Yes'],
          ['Remove or rename a field, change its type', 'No — breaking'],
          ['Add a required parameter', 'No — breaking'],
          ['Change what existing behaviour means', 'No — breaking'],
        ],
      },
      {
        kind: 'list',
        items: [
          'Prefer ==compatible extension over new versions==. When a new version is unavoidable, keep the old one alive for a migration window.',
          'Clients must ignore unknown fields; that is what lets the server add fields safely. Be strict in what you send, lenient in what you accept.',
          'Version the API as a whole, not endpoint by endpoint.',
          'Announce deprecations early, and use `Deprecation` and `Sunset` response headers to tell callers when a version goes away.',
        ],
      },
      {
        kind: 'callout',
        label: 'Rule of thumb',
        text: '==Add, never change, never remove.== When a change is unavoidable, bump the major version and give the old one time to retire.',
      },
    ],
  },
  {
    id: 'graphql',
    title: 'GraphQL',
    blocks: [
      {
        kind: 'p',
        text: 'A page that needs a user, their posts, comments, and likes costs REST several round trips, and each response may over- or under-fetch. GraphQL lets the client ==decide the shape of the response==.',
      },
      {
        kind: 'code',
        label: 'Schema',
        code: 'type User {\n  id: ID!\n  name: String!\n  posts(first: Int, after: String): PostConnection  # paginated relation\n}\ntype Query { user(id: ID!): User }                            # reads\ntype Mutation { createUser(input: CreateUserInput!): User }  # writes take Input types',
      },
      {
        kind: 'table',
        caption: 'REST vs GraphQL',
        head: ['Dimension', 'REST', 'GraphQL'],
        rows: [
          ['Endpoints', 'One per resource: /users, /posts', 'Usually just /graphql'],
          ['Response shape', 'Server decides', 'Client decides'],
          ['Versioning', 'Explicit /v1, /v2', 'Schema evolves; fields marked @deprecated'],
          ['Caching', 'HTTP caching works out of the box', 'Mostly at the application layer'],
          ['Main risks', 'Round trips, over-fetching', 'N+1 queries, deep queries, hard to rate-limit'],
        ],
      },
      {
        kind: 'p',
        text: 'GraphQL usually answers `200 OK` even on failure, puts errors in an `errors` array, and ==can return partial data alongside them==. Put the error kind in `extensions.code` so clients can branch on it.',
      },
      {
        kind: 'defs',
        items: [
          { term: 'Modular schema', text: 'Split by domain rather than one giant schema; name things so frontend and backend share a vocabulary.' },
          { term: 'Depth limit', text: 'user → posts → comments → … can nest forever. Cap it, typically somewhere between 6 and 10 levels.' },
          { term: 'Complexity scoring', text: 'Depth alone is not enough: a shallow `first: 10000` can still flatten the server. Score fields and reject queries over budget.' },
          { term: 'DataLoader', text: 'Fetching posts for 10 users naïvely is 1 + 10 queries. Batch IDs from the same tick into one query, and ==create the loader per request== so its cache never leaks between users.' },
          { term: 'Persisted queries', text: 'In production, accept only pre-registered query hashes and turn off introspection.' },
          { term: 'Field-level authorisation', text: 'With a single endpoint the gateway cannot enforce fine-grained rules. Check permissions in resolvers or the business layer.' },
        ],
      },
      {
        kind: 'p',
        text: 'Paginate with Relay-style connections (`edges`, `node`, `pageInfo`, `endCursor`) — cursor pagination under another name. Expose opaque global IDs, not database auto-increment keys.',
      },
    ],
  },
  {
    id: 'authentication',
    title: 'Authentication',
    blocks: [
      {
        kind: 'p',
        text: 'Authentication answers ==“who are you?”== Nothing can be restricted until the system knows who is asking.',
      },
      {
        kind: 'table',
        caption: 'Common schemes',
        head: ['Scheme', 'How it works', 'Verdict'],
        rows: [
          ['Basic Auth', 'username:password, Base64-encoded, on every request', 'Base64 is not encryption; internal tools only, HTTPS mandatory'],
          ['Bearer token', 'An access token on every request', 'Today’s default; stateless and easy to scale'],
          ['OAuth 2.0 + JWT', 'Sign in via an identity provider, receive a signed token', 'No server-side session to store'],
          ['Access + refresh', 'Short-lived access token for calls; long-lived refresh token to renew it', 'Users stay signed in, tokens rotate often'],
          ['SSO', 'Sign in once, use many services', 'Built on OIDC or SAML'],
        ],
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Sign in: receive a short-lived access token (around 15 minutes) and a long-lived refresh token.',
          'Call the API with `Authorization: Bearer <access>`.',
          'The access token expires and the API answers `401`.',
          'In the background, trade the refresh token for a new access token — and a new refresh token. The user never notices.',
        ],
      },
      { kind: 'h3', text: 'Current OAuth practice' },
      {
        kind: 'list',
        items: [
          'Drop the ==implicit grant== (tokens in the URL) and the ==password grant== (a third party sees the password).',
          'Use the authorisation code flow with ==PKCE== everywhere, including apps with a backend.',
          'Match redirect URIs exactly; no wildcards.',
          'Sender-constrain refresh tokens, or rotate them on every use and revoke the old one immediately.',
        ],
      },
      { kind: 'h3', text: 'Validating a JWT' },
      {
        kind: 'list',
        items: [
          'Pin the allowed algorithms on the server. Never trust the token’s own `alg` header, and reject `alg: none`.',
          'Check `iss` (who signed it), `aud` (who it is for), and `exp` (whether it has expired).',
          'A JWT is ==signed, not encrypted==. Anyone can read the payload, so keep secrets out of it.',
        ],
      },
      {
        kind: 'callout',
        label: 'In the browser',
        text: 'Keep refresh tokens in an ==HttpOnly, Secure, SameSite cookie==, not localStorage, where any XSS can read them. And OAuth 2.0 itself is an authorisation protocol; “sign in with…” identity rides on OpenID Connect on top of it.',
      },
    ],
  },
  {
    id: 'authorization',
    title: 'Authorisation',
    blocks: [
      {
        kind: 'p',
        text: 'Authorisation answers ==“what may you do?”== On a code-hosting site, one person can push, another can only read, and an admin can change settings or delete the repository.',
      },
      {
        kind: 'defs',
        items: [
          { term: 'RBAC — by role', text: 'Admin does everything, Editor can change but not delete, Viewer reads. The most common model in dashboards and CMSs.' },
          { term: 'ABAC — by attribute', text: 'Combine user, resource, and environment attributes (time, place, device). Flexible, but policies get hard to manage and can conflict.' },
          { term: 'ACL — by resource', text: 'Each resource carries its own list: Alice reads, Bob reads and writes. Fine-grained, like document sharing, but unwieldy at scale.' },
        ],
      },
      {
        kind: 'code',
        label: 'ABAC policy (pseudocode)',
        code: 'allow read, write if\n  user.department == "HR"\n  and resource.classification == "internal"',
      },
      {
        kind: 'p',
        text: 'OAuth 2.0 and JWT are ==mechanisms==: they carry identity and scopes. RBAC, ABAC, and ACL are ==models==: they decide what is allowed. Real systems usually combine them.',
      },
      {
        kind: 'callout',
        label: 'The usual failure',
        text: 'Most API breaches are not “not logged in” but “logged in, and nobody checked this record is yours”. Check ownership on ==every object fetched by ID== (`order.ownerId === currentUser.id`), and guard admin routes on the server — a hidden button is not access control.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    blocks: [
      {
        kind: 'p',
        text: 'The API is the front door. Seven defences cover the network and input layers.',
      },
      {
        kind: 'defs',
        items: [
          { term: 'Rate limiting', text: 'Per endpoint, per user or IP, plus a global ceiling. IP alone fails against a botnet where each address stays under the limit. Answer `429`.' },
          { term: 'CORS', text: 'Allow only your own frontend origin to call from the browser.' },
          { term: 'Injection', text: 'User input spliced into a query lets attackers rewrite it. ==Always parameterise== or use an ORM.' },
          { term: 'WAF', text: 'Filter known attack signatures at the edge.' },
          { term: 'Private network', text: 'Internal admin APIs answer only on the company VPN; public requests are dropped.' },
          { term: 'CSRF', text: 'A hostile site rides the user’s logged-in cookie. Defend with CSRF tokens and SameSite cookies.' },
          { term: 'XSS', text: 'A `<script>` in a comment runs in other users’ browsers. Defend with output escaping, CSP, and HttpOnly cookies.' },
        ],
      },
      {
        kind: 'code',
        label: 'Concatenation vs parameters',
        code: "// input: ' OR '1'='1\nconst bad = \"SELECT * FROM users WHERE name = '\" + input + \"'\"\n\nconst sql = 'SELECT * FROM users WHERE name = $1'\nawait db.query(sql, [input])",
      },
      {
        kind: 'p',
        text: '`Retry-After` only tells a client how long to wait once it has been rejected. Emerging `RateLimit-*` headers report the remaining quota ==before== rejection, so well-behaved clients can slow down on their own.',
      },
      {
        kind: 'table',
        caption: 'OWASP API Security Top 10 (2023)',
        head: ['Risk', 'In one line', 'Defence'],
        rows: [
          ['API1 Broken object-level authorisation', 'Change the ID in the URL, read someone else’s order', 'Check ownership on every fetch by ID'],
          ['API2 Broken authentication', 'Weak passwords, unlimited attempts, unchecked tokens', 'Throttle logins, MFA, validate tokens properly'],
          ['API3 Broken property-level authorisation', 'Leaking fields, or letting clients set isAdmin', 'Allow-list fields in and out'],
          ['API4 Unrestricted resource consumption', 'No limit cap, upload size, or rate limit', 'Rate limits, page caps, timeouts, size limits'],
          ['API5 Broken function-level authorisation', 'Ordinary users reach admin endpoints', 'Deny by default, allow by role'],
          ['API6 Unprotected business flows', 'Bots scalping tickets, farming coupons', 'Detect automation, challenges, business quotas'],
          ['API7 SSRF', 'Pass a URL, the server fetches your internal network', 'URL allow-lists, block internal addresses'],
          ['API8 Security misconfiguration', 'Open CORS, stack traces, default passwords', 'Harden config, one error format'],
          ['API9 Improper inventory', 'A forgotten v1, a test environment on the internet', 'Keep an API inventory, retire old versions'],
          ['API10 Unsafe third-party consumption', 'Trusting whatever an upstream returns', 'Validate third-party data too, over HTTPS'],
        ],
      },
      {
        kind: 'callout',
        label: 'Why API1 tops the list',
        text: 'Authentication can be enforced once at the gateway. ==“Is this record yours?”== can only be answered in business code, so it is the check most often forgotten.',
      },
    ],
  },
  {
    id: 'choosing',
    title: 'Putting it together',
    blocks: [
      {
        kind: 'table',
        caption: 'Choosing a style',
        head: ['Situation', 'Reach for'],
        rows: [
          ['Public API for third-party developers', 'REST with an OpenAPI description'],
          ['Pages stitching lots of data; clients needing different fields', 'GraphQL, with depth and complexity limits'],
          ['Internal service calls where speed and types matter', 'gRPC'],
          ['The server must push', 'WebSocket, SSE, or webhooks'],
        ],
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          '==Requirements and boundaries==: who calls it, read- or write-heavy, what is out of scope.',
          '==Resources and methods==: `POST /orders`, `GET /orders?cursor=`.',
          '==Reliability==: idempotency keys, timeouts, `202` for slow work.',
          '==Security and evolution==: authentication, object-level checks, rate limits, versioning.',
        ],
      },
      {
        kind: 'callout',
        label: 'What seniority looks like',
        text: 'Not writing CRUD, but naming the trade-offs unprompted: why cursor over offset, how a retry never double-charges, how a field changes without breaking old clients, and ==checking ownership on every read==.',
      },
    ],
  },
]

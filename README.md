# NodeJS-AUTH-API

A REST authentication API built with Express and MongoDB: users register, log in, and get back a JWT.

## Stack

- **Express** for routing and middleware
- **MongoDB + Mongoose** for user storage
- **jsonwebtoken** for signing access tokens
- `cors` and `body-parser` for request handling

## Endpoints

| Method | Path | Body / params | Returns |
|---|---|---|---|
| `POST` | `/register` | `{ Username, Email, Password }` | The created user record |
| `POST` | `/login` | `{ Email, Password }` | `{ token }` — a JWT valid for 1 hour |

The server listens on port **5000** and connects to `mongodb://127.0.0.1:27017/auth`.

## Running

```bash
npm install
npm start
```

`npm start` runs `nodemon server.js`, so the server restarts on file changes. Start a local MongoDB on the default port first.

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"Username":"aamir","Email":"a@example.com","Password":"secret"}'
```

## Known limitations

Written as a practice project, and it shows in the security basics — worth knowing before reusing any of it:

- Passwords are stored as plain strings; there is no hashing (no bcrypt/argon2 in the dependency list).
- The login route does not compare the submitted password — it looks the user up by email and signs a token.
- The JWT secret and the database URI are hardcoded in `server.js` rather than read from the environment.

## Notes

`node_modules` is committed in this repo, so the tree is larger than the source warrants.

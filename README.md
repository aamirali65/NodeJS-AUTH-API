# NodeJS-AUTH-API

A REST authentication API built with Express and MongoDB: users register, log in, and get back a JWT.

## Stack

- **Express** for routing and middleware
- **MongoDB + Mongoose** for user storage
- **bcryptjs** for password hashing
- **jsonwebtoken** for signing access tokens
- **dotenv** for configuration
- `cors` and `body-parser` for request handling

## Setup

Configuration comes from the environment — nothing secret lives in the source. Copy the example file and fill it in:

```bash
cp .env.example .env
# MONGO_URI=mongodb://127.0.0.1:27017/auth
# JWT_SECRET=<a long random string, e.g. `openssl rand -hex 32`>
# PORT=5000

npm install
npm start
```

`npm start` runs `nodemon server.js`. If `MONGO_URI` or `JWT_SECRET` is missing, the server refuses to start and says which values it needs.

`.env` is gitignored. `node_modules` is still committed in this repo from earlier, so run `npm install` after pulling to pick up `bcryptjs` and `dotenv`.

## Endpoints

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| `POST` | `/register` | `{ Username, Email, Password }` | `201` with the created user (no password field) | `400` missing field, `409` email already registered |
| `POST` | `/login` | `{ Email, Password }` | `200` with `{ token }`, a JWT valid for 1 hour | `400` missing field, `401` invalid email or password |

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"Username":"aamir","Email":"a@example.com","Password":"secret"}'

curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"Email":"a@example.com","Password":"secret"}'
```

## Security notes

- Passwords are hashed with bcrypt (cost 10) before being stored; the plain text is never written to the database.
- Login compares the submitted password against the stored hash, and returns the same `401` for an unknown email as for a wrong password, so responses don't reveal which accounts exist.
- The password hash is stripped from every response.
- The JWT secret, database URI and port are read from the environment instead of being hardcoded.
- **Accounts registered before this change** were stored as plain text and will no longer pass the hash comparison. Re-register them, or write a one-off migration in which each user's password is replaced with `bcrypt.hash(oldPassword, 10)`.

## Known gap

The token is issued but nothing validates it yet — there is no protected route and no auth middleware, so the JWT can't be used for anything until you add one. That is the next piece of work, not a finished feature.

## Notes

Practice project. Queries are simple Mongoose calls in the route handlers with no service layer, and `nodemon` sits in `dependencies` rather than `devDependencies`.

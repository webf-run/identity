# API Base
Helper for building multi-tenant apps using SQLite.

## Features
- Preconfigured authentication with social signups.
- Multi-tenant isolated DB solutions.


## Design

This package provides following middlewares.

### Authentication middleware

Define login related paths:

- `GET /auth/login/:provider`.
- `GET /auth/login/:provider/callback`.
- `GET /auth/info`.

### Session middleware

Recognize user session using either cookie or authorization headers. It supports:

- `Authorization: Bearer <token>`.
- Cookie for session management.

### Static middleware

Serve any static frontend application (typically SPA application).

## Local development

Use the following command to run all the tests:

```bash
npm run test -- test/**/*.spec.ts
```

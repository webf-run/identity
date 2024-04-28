# Auth

Framework independent multi-tenant authentication system. Built on top of Postgres.


## Features
- Opinionated authentication systems.
- Works in any framework.


## Install

```
npm install --save @webf/auth
```

## Running automation

An extensive suite of automation tests (mix of unit, integration and end-to-end) tests maintains the quality and verification of the library functionality. There are few things to understand about the test strategy:

- Tests are automated. Emphasis is on automation. So, it is mix of unit, integration and end-to-end tests. There is no specific seggragation.
- Mocking is kept to minimum.
- The core functionality is to interact and manage DB consistency. Hence, Postgres is not mocked.
- Anyways, I personally think that mocking is pointless.

Since, the tests run against real DB, you need to setup DB locally with migrations. Use the following steps to setup DB Locally:

```bash
# Create a .env.test file using `.env.backup` file.
# Add appropriate enviornment variables for database connectivity.
cp ./.env.backup .env.test

# Create a database and run migrations
npm run test:db:setup

# Run tests
npm run test

# Cleanup DB
npm run test:db:teardown
```

# Bisa
Backend for Chidi.

## Useful commands

```bash
# Generates assets like Prisma Client.
prisma generate

# Generate Database migration
prisma migrate dev --create-only -name some-migration-name
```

## Local Setup

Create an `.env` file at the root of the repository. Set environment variable DATABASE_URL as per the following.
```
DATABASE_URL postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

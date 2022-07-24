# Bisa
Backend for Chidi.

## Configuration

### URLs that must be configured

  - Claim invitation
  - Join invitation
  - Reset forgotten password

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
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

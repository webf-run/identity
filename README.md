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

Create an `.env` file at the root of the repository. Copy the content of `.env.backup` and set appropriate values.

### Sample postgres docker command

```bash
docker run -d --rm --name postgres-db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  --mount source=pg-data-vol,target=/var/lib/postgresql/data \
  postgres:14.4

# Connect using PSQL
docker run --rm -it postgres:14.4 psql -h localhost -U postgres
```

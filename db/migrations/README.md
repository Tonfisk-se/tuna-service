# DB migrations

For db migrations the database migration
management tool `node-pg-migrate` is used.
Its full documentation can be found at:
- https://salsita.github.io/node-pg-migrate/

The most common migration actions have been scripted
into npm scripts (see `package.json`):
- migrate:up
- migrate:down
- migrate:redo
- migrate:create

## Creating a fresh database migration

`npm run migrate:create :descriptive_name_of_the_migration:`

## Running migrations locally

With the PostgreSQL tuna db running
and env var DATABASE_URL set to the corresponding
value for the the db, run:

- `npm run migrate:up/down`

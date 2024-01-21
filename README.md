# CRM
A friendly CRM for learning about databases. However, I mostly built it to learn about crafting GraphQL Server with Postgres.


## Local development

### Basic

Setup your local repository:

```bash
# STEP 1: Install dependencies.
npm install

# STEP 2:
# Generate GraphQL types for test queries.
# Make TypeScript happy and get rid of all the errors.
npm run test:gql
```

### Development

To develop locally, you need the Postgres database. Keep the credentials handy. Let's use `crm_dev` as database name.

```bash
# STEP 1: Generate an environment variables file.

# Windows
copy .env.backup .env

# Linux/Mac
cp .env.backup .env

# STEP 2:
# Edit .env file with appropriate environment variables.
# Set environment variables to correct values (database and oauth2 credentials).
vim .env

# STEP 3:
# Create empty database (Use the postgres client like psql, etc.)
psql> create database crm_dev;

# STEP 4: Run migrations
npm run dev:db:migrate

# STEP 5: Run the applicaton
npm run dev
```

At this stage, your app should be running at port `8890` and you should see the prompt:

```bash
🚀 Server ready at 0.0.0.0:8890
```

You cannot do much with empty database. You will need to seed it. To seed it, you need to create first tenant/account. To create a tenant, you need ApiKey. The first API key is generated using special route. Send a post request with empty JSON body.

```bash
POST http://localhost:8890/auth/init

# Curl example
curl -H 'Content-Type: application/json' -d '{}' \
  -X POST http://localhost:8890/auth/init
```

Once, the response returns the **ApiKey** which should be noted down in your `.env` as a comment for future reference. The key is not recoverable. Using this key, you can now start making the GraphQL requests.


### Testing

There are couple of integration tests which does not need full server. To setup tests, you need a database with some seed values. Following commands provide some helper scripts.

Execute the steps in the given order:
```bash

# Regenerates types for test GraphQL queries.
npm run test:gql

# Setup a test test database (Uses .env.test file)
# The .env.test file is same as .env file.
npm run test:db:setup

# Teardown the database (Uses .env.test file)
npm run test:db:teardown

# Run all the tests
npm run test -- test/**/*.spec.ts
```

### Environment variables

Have a look at the `.env.backup` file for all the required environments.

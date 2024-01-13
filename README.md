# CRM
A friendly CRM for learning about databases. However, I mostly built it to learn about crafting GraphQL Server with Postgres.


## Local development

Execute the steps in the given order:
```bash
# STEP 1: Install dependencies
npm install

# STEP 2: Generate GraphQL types for test queries
npm run test:gql

# STEP 3: Generate an environment variables file that will be used to run the repository

# Windows
copy .env.backup .env

# Linux/Mac
cp .env.backup .env

# STEP 4: Edit .env file with appropriate environment variables
vim .env
```

Use the following command to run all the tests:

```bash
npm run test -- test/**/*.spec.ts
```

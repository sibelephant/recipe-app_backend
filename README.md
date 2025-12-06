# Recipe App Server

A robust Node.js backend for a Recipe Application, built with Express, Drizzle ORM, and PostgreSQL.

## Features

- **Authentication**: Secure user registration and login using JWT.
- **Recipe Management**: Create, read, update, and delete recipes.
- **Search**: Search recipes by title, cuisine, difficulty, and ingredients.
- **Daily Recipe**: Automated daily featured recipe selection using Cron jobs.
- **Image Uploads**: Support for uploading recipe images.
- **Social Features**:
  - **Favorites**: Users can favorite recipes.
  - **Comments & Ratings**: Users can comment on and rate recipes.
- **Documentation**: Interactive API documentation via Swagger UI.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer
- **Validation**: Zod (via Drizzle-Zod)
- **Documentation**: Swagger UI Express

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database (or Neon connection string)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd recipe-app_server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**

    Create a `.env` file in the root directory and configure the following variables:

    ```env
    PORT=3000
    DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
    JWT_SECRET=your_super_secret_jwt_key
    ALLOWED_ORIGINS=http://localhost:3000
    ```

4.  **Database Migration:**

    Push the schema to your database:

    ```bash
    npm run db:push
    ```

    _(Optional) Seed the database with initial data:_

    ```bash
    npm run db:seed
    ```

## Running the Server

- **Development Mode:**

  ```bash
  npm run dev
  ```

- **Production Mode:**

  ```bash
  npm start
  ```

The server will start on `http://localhost:3000` (or your specified PORT).

## API Documentation

Once the server is running, you can access the full API documentation at:

**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

This interactive documentation allows you to explore endpoints, schemas, and test requests directly from your browser.

## Project Structure

```
src/
├── config/         # Configuration (Env, DB connection)
├── controllers/    # Request handlers
├── db/             # Database schema and migration logic
├── docs/           # Swagger documentation JSON
├── jobs/           # Cron jobs (e.g., Daily Recipe)
├── middleware/     # Express middleware (Auth, Uploads)
├── routes/         # API route definitions
├── utils/          # Utility functions
└── index.js        # Application entry point
```

## License

ISC

# Backend Silver

This is the backend service for the Silver project. It's built with NestJS and uses Prisma as an ORM.

## Repository

https://github.com/jardel-vieira-wyrd/backend-silver

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/jardel-vieira-wyrd/backend-silver.git
   cd backend-silver
   ```

2. Build and start the Docker containers:
   ```
   docker-compose up --build
   ```

3. The server should now be running at `http://localhost:3000`

## API Documentation

This project includes Swagger UI for API documentation. Once the server is running, you can access the Swagger UI at:

`http://localhost:3000/api`

## Database Connection from Backend

To verify the database connection, follow these steps:

1. In Swagger (http://localhost:3000/api), click on POST /auth/register
2. Click on "Try it out"
3. Click on "Execute"
4. You will see the token in the response, copy it
5. Click on Authorize and enter the token

## Technologies

- Node.js 20
- NestJS (version specified in package.json)
- Prisma (version specified in package.json)
- PostgreSQL
- Jest

## Docker

The project includes a Dockerfile for containerization. Here's a brief overview of what it does:

- Uses Node.js 20 as the base image
- Installs project dependencies, including bcrypt and Prisma CLI
- Copies the Prisma schema and generates the Prisma client
- Builds the NestJS application
- Exposes ports 3000 (main application) and 5555 (Prisma Studio)
- Runs the production build of the application

## Running in Development Mode

To run the application in development mode with hot-reloading:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run start:dev
   ```

## Test Results

### Unit Tests

Run unit tests with:
```
npm run test
```

Latest unit test results:
```
Test Suites: 8 passed, 8 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        9.873 s
```

### End-to-End (E2E) Tests

Run E2E tests with:

## Frontend Repository

https://github.com/jardel-vieira-wyrd/frontend-silver
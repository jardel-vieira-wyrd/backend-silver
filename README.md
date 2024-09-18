# Backend Silver Task Manager

This is the backend service for the Silver Task Manager project. It's built with NestJS and uses Prisma as an ORM.

The database schema is the following:

Model User
- id
- name
- email
- password
- createdAt
- updatedAt

Model Task
- id
- project (string, project name)
- title
- description
- dueDate
- status (enum: 'TO_DO', 'IN_PROGRESS', 'DONE')
- priority (0 to 5, 5 being the highest priority)
- createdAt
- updatedAt

Model TaskPermission
- id
- userId
- taskId
- role (enum: 'OWNER', 'EXECUTOR', 'STAKEHOLDER')
- createdAt
- updatedAt

The main endpoints are:

- POST /auth/register
- POST /auth/login
- POST /tasks (create a task)
- GET /tasks/:id (get a task by id)
- PUT /tasks/:id (update a task by id)
- DELETE /tasks/:id (delete a task by id)
- POST /tasks/:id/permissions (add a permission to a task)
- GET /tasks/projects/:groupBy (list all organization projects and tasks)

## Technologies

- Node.js 20
- NestJS 10.0.0
- Prisma 5.19.1
- PostgreSQL 13
- Jest 29.5.0

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

3. The server should now be running at [http://localhost:3000](http://localhost:3000)

## API Documentation

This project includes Swagger UI for API documentation. Once the server is running, you can access the Swagger UI at:

[http://localhost:3000/api](http://localhost:3000/api)

To verify the database connection, follow these steps:

1. In Swagger,click on POST /auth/register
2. Click on "Try it out"
3. Click on "Execute"
4. You will see the token in the response, copy it
5. Click on Authorize and enter the token

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
```
npm run test:e2e
```

Latest E2E test results:
```
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Time:        1.001 s

## Frontend Repository

https://github.com/jardel-vieira-wyrd/frontend-silver
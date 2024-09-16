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

## Database Access

To access the database using Prisma Studio:

1. Ensure the database container is running
2. Run the following command:
   ```
   npx prisma studio
   ```
3. Prisma Studio will be available at `http://localhost:5555`

## Technologies

- Node.js 20
- NestJS (version specified in package.json)
- Prisma (version specified in package.json)
- PostgreSQL

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

## Additional Commands

- `npm run build`: Build the application
- `npm run start:prod`: Start the application in production mode
- `npm run test`: Run tests
- `npm run lint`: Lint the codebase



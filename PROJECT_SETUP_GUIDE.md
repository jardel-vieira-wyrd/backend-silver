# Project Setup Guide

## Before Starting to Code

### Required Tools and Accounts

Before beginning this project, ensure you have the following tools installed and configured:

- GitHub CLI
- Docker

### Verify Tool Installation

Run the following commands to verify that your tools are correctly installed and configured:

Verify GitHub CLI
gh auth status

Expected output should be similar to:
github.com
  ✓ Logged in to github.com as <YOUR_USERNAME> (<YOUR_EMAIL>)
  ✓ Git operations for github.com configured to use https
  ✓ Token: *******************

Verify Docker
docker --version && docker info

Expected output should show Docker version information and system-wide information about the Docker installation.

## Create Repository

### 1. Initialize Git Repository

git init

### 2. Create Remote Repository and Push Initial Commit

# Set environment variables
export PROJECT_NAME="backend-nestjs"
export GITHUB_USERNAME="jardel-vieira-wyrd"

# Create the remote repository
gh repo create $PROJECT_NAME --public --confirm

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit: Add project setup guide"

# Set the correct Git user name and email
git config user.name "jardel-vieira-wyrd"
git config user.email "jardel.vieira@wyrd.com.br"

# Set the main branch
git branch -M main

# Add the remote repository
git remote add origin https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git

# Push the commit to the main branch
git push -u origin main

## Set Up NestJS Project

### 1. Install NestJS CLI

Install the NestJS CLI globally:

npm install -g @nestjs/cli

### 2. Create NestJS Project

Create a new NestJS project in the current directory:

nest new . --package-manager npm

When prompted, select npm as the package manager.

This command will create the basic structure for a NestJS application, including:
- src/ directory with main.ts, app.module.ts, app.controller.ts, and app.service.ts
- test/ directory for your tests
- nest-cli.json configuration file
- package.json with project dependencies
- tsconfig.json for TypeScript configuration

To verify that the NestJS environment is set up correctly, run the default tests:

npm run test

You should see output indicating that the tests have passed.

## Set Up PostgreSQL Database with Docker

### 1. Define Database Variables

Export the necessary environment variables:

export DB_NAME="backenddb"
export DB_USER="postgres"
export DB_PASSWORD="nestjsprisma"
export DB_PORT="5432"
export DOCKER_CONTAINER_NAME="postgres-db"

### 2. Create and Run PostgreSQL Container

Create and start the PostgreSQL container:

docker run --name $DOCKER_CONTAINER_NAME -e POSTGRES_DB=$DB_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -p $DB_PORT:5432 -d postgres

### 3. Verify Container Status

Check if the container is running:

docker ps

You should see your container listed in the output.

## Set Up Prisma ORM and Database Schema

### 1. Install Prisma dependencies

Install Prisma CLI as a dev dependency:

npm install prisma --save-dev

Install Prisma Client as a regular dependency:

npm install @prisma/client

### 2. Initialize Prisma in the project

Run Prisma init command:

npx prisma init

### 3. Configure database connection

Remove existing DATABASE_URL from .env:

grep -v DATABASE_URL .env > .env.tmp && mv .env.tmp .env

Add correct DATABASE_URL to .env:

echo "DATABASE_URL=\"postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public\"" >> .env

### 4. Create initial Prisma schema

Update the prisma/schema.prisma file with the following content:

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

### 5. Create and apply database migration

Create and apply the initial migration:

npx prisma migrate dev --name init

This command creates a new migration based on your schema changes and applies it to the database.

Note: For production deployments, you'll need to use `npx prisma migrate deploy` as part of your deployment process to apply migrations to your production database.

### 6. Verify Prisma schema synchronization

To verify that your Prisma schema is correctly synchronized with the database, run:

npx prisma db push

The expected output should be:

The database is already in sync with the Prisma schema.

If you see this message, it means your database connection is working correctly and the schema is synchronized.

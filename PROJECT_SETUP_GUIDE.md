# Project Setup Guide

## Before Starting to Code

### Required Tools and Accounts

Before beginning this project, ensure you have the following tools installed and configured:

- GitHub CLI

### Verify Tool Installation

Run the following command to verify that your GitHub CLI is correctly installed and configured:

Verify GitHub CLI
gh auth status

Expected output should be similar to:
github.com
  ✓ Logged in to github.com as <YOUR_USERNAME> (<YOUR_EMAIL>)
  ✓ Git operations for github.com configured to use https
  ✓ Token: *******************

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

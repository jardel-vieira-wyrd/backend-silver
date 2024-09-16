FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies, bcrypt, and Prisma CLI
RUN npm install
RUN npm install bcrypt
RUN npm install -g prisma

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 5555

CMD ["npm", "run", "start:prod"]

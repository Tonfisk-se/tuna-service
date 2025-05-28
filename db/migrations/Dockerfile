# Build environment
FROM node:17-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci
# Copy the rest of the application code
COPY . .

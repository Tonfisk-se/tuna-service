# Build environment
FROM node:17-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Expose the port for at which the app will run
EXPOSE 3000:3000
CMD ["npm", "start"]
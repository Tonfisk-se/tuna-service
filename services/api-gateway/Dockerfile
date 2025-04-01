# Build environment
FROM node:17-alpine as builder
WORKDIR /services/api-gateway
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

# Expose the port for at which the app will run
EXPOSE 4200:4200
CMD ["npm", "start"]
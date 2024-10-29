# Dockerfile for the frontend project

# Use the official Node.js 18 image as the base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json if available
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Use a lightweight server to serve the static files
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Install a lightweight HTTP server to serve the built frontend
RUN npm install -g serve

# Expose the port that the HTTP server will use
EXPOSE 3000

# Serve the application using 'serve' on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
# Build stage
FROM node:lts AS build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy all project files (trừ những file trong .dockerignore)
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:1.21.0-alpine

# Copy build output to Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration if needed
COPY Web/Portal/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

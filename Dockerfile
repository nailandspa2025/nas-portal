# Step 1: Build the React (Vite) application
FROM node:lts AS build
WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Ensure the output folder exists and has proper permissions
RUN npm run build && ls -lah /app/dist

# Step 2: Serve the app using a lightweight server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# COPY ssl/nasshine.com.crt /etc/nginx/certs/nasshine.com.crt
# COPY ssl/nasshine.com.key /etc/nginx/certs/nasshine.com.key

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

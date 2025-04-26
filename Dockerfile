# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
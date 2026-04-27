# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix React Router refresh issue
RUN echo 'server { \
  listen 8080; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
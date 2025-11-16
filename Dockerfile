# Development stage
FROM node:20-alpine as development

WORKDIR /app

# Installera dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Kopiera source code
COPY . .

# Exponera port
EXPOSE 5173

# ✅ VIKTIGT: Lägg till --host 0.0.0.0 för att lyssna på alla interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage (oförändrad)
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage (oförändrad)
FROM nginx:alpine as production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

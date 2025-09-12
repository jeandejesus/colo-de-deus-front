# Etapa 1: Build Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copia os arquivos buildados (ajuste para incluir /browser)
COPY --from=build /app/dist/colo-de-deus-front/browser /usr/share/nginx/html

# Remove configuração default do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

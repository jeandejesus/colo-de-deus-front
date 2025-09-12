# Etapa 1: Build Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar todo o código e buildar
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copiar build Angular para a pasta do nginx
COPY --from=build /app/dist/colo-de-deus-front/browser /usr/share/nginx/html

# Copiar configuração customizada do Nginx para servir Angular corretamente
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta (o nginx-proxy vai cuidar das portas externas)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

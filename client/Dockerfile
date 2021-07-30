FROM node:16 as build

WORKDIR /app

COPY ./client /app
COPY ./shared /shared

RUN npm ci
RUN npm run build

FROM caddy:2-alpine

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY ./client/Caddyfile.production /etc/caddy/Caddyfile

FROM node:18 as app_build_client

WORKDIR /app

COPY ./client /app
COPY ./shared /shared

RUN npm ci
RUN npm run build

FROM caddy:2-alpine as app_client

WORKDIR /app
COPY --from=app_build_client /app/dist /app/dist
COPY ./client/Caddyfile /etc/caddy/Caddyfile


FROM node:18 as app_build_server

WORKDIR /app

COPY ./server /app
COPY ./shared /shared

RUN npm ci
RUN npm run build

FROM node:18-alpine as app_server

ENV NODE_ENV=production

RUN npm install pm2 -g

WORKDIR /app
COPY --from=app_build_server /app/dist /app/dist
COPY --from=app_build_server /app/package.json .
COPY --from=app_build_server /app/package-lock.json .

RUN npm i

CMD ["pm2-runtime", "dist/bundle.js"]

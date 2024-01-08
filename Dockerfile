FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

FROM caddy:2-alpine as client

WORKDIR /app
COPY --from=build /app/client/dist /app/dist
COPY ./client/Caddyfile.production /etc/caddy/Caddyfile


FROM node:20-alpine as server

ENV NODE_ENV=production

RUN npm install pm2 -g

WORKDIR /app
COPY --from=build /app/server/dist /app/dist
COPY --from=build /app/server/package.json .
COPY --from=build /app/server/package-lock.json .

RUN npm i

EXPOSE 8080

CMD ["pm2-runtime", "dist/bundle.js"]

FROM node:16 as build

WORKDIR /app

COPY ./server /app
COPY ./shared /shared

RUN npm ci
RUN npm run build

FROM node:16-alpine

ENV NODE_ENV=production

RUN npm install pm2 -g

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN npm i

EXPOSE 8080

CMD ["pm2-runtime", "dist/bundle.js"]

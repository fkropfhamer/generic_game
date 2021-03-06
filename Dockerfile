FROM node:14 as build

WORKDIR /app

COPY . /app

RUN npm i
RUN npm run build
RUN npm run lint
RUN npm run test

FROM node:14-alpine

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN npm i

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["run", "start:prod"]

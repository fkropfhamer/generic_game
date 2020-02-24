FROM node:12 as build

WORKDIR /app

COPY . /app

RUN npm i
RUN npm run build
RUN npm run lint
RUN npm run test

FROM node:12-alpine

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/public /app/public
COPY --from=build package.json .
COPY --from=build package-lock.json .

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["run", "start:prod"]

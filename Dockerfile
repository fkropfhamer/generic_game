FROM node:12

WORKDIR /app

COPY . /app

RUN npm i
RUN npm run lint
RUN npm run test

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["run", "start"]

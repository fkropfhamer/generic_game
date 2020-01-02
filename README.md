[![pipeline status](https://gitlab.lrz.de/gruppe-gg/gg/badges/master/pipeline.svg)](https://gitlab.lrz.de/gruppe-gg/gg/commits/master) [![coverage report](https://gitlab.lrz.de/gruppe-gg/gg/badges/master/coverage.svg)](https://gitlab.lrz.de/gruppe-gg/gg/commits/master)

# Group GG: `INSERT GAME TITLE`

## requires:

- node.js
- npm

## getting started:

1. `npm i`
2. `npm start`
3. open browser on `localhost:8080`
4. play!

## commands:

### installation:

- `npm install`
-> install packages

- `npm ci`
-> reinstall all packages

### for development:

- `npm run dev` 
-> for server 

- `npm run watch`
-> for client 

### for production:

- `npm run build:server`
-> building server

- `npm run build:client`
-> building client

- `npm run build`
-> build client + server

- `npm run start`
-> start project

### for linting:

- `npm run lint`
-> check coding style

- `npm run lint:fix`
-> fix coding style

### for testing:

- `npm run test`
-> run all tests

- `npm run test:coverage`
-> run all tests with coverage report

### for docker

- `docker build -t gg .`
-> build docker image

- `docker run -it -p 8080:8080 gg:latest`
-> run docker container interactive

- `docker run -it -p 8080:8080 -d gg:latest`
-> run docker container in background



## dependencies:

### used packages:   
- socket.io
- webpack
- babel
- express
- bootstrap
            
### code style:
- eslint
- prettier
- airbnb


![Node.js CI](https://github.com/fkropfhamer/generic_game/workflows/Node.js%20CI/badge.svg)

# Generic Game

University group project

## requires:

- node.js
- npm

## getting started:

1. `npm i`
2. `npm run dev:server`
3. `npm run dev:client`
4. open browser on `localhost:3000`
5. play!

## commands:

### installation:

- `npm install`
-> install packages

- `npm run ci`
-> reinstall all packages

### for development:

- `npm run dev:server` 
-> for server 

- `npm run dev:client`
-> for client 

### for production:

- `npm run build:server`
-> building server

- `npm run build:client`
-> building client

- `npm run build`
-> build client + server

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

- `npm run docker:build`
-> build docker images

- `npm run docker:build:server`
-> build server docker image

- `npm run docker:build:client`
-> build client docker image

## dependencies:

### used packages:   
- socket.io
- babel
            
### code style:
- eslint
- prettier
- airbnb


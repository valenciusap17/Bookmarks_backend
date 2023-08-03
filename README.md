<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Installation

```bash
$ npm install
```

## Dealing with database using docker

```bash
# activate your docker desktop
open docker desktop

# start db with docker compose
$ npm run db:dev:restart

# deleting container after used
$ npm run db:dev:rm
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# run e2e tests with starting your db for test purpose
$ npm run test:e2e

# deleting db test docker container when done
$ npm run db:test:rm
```

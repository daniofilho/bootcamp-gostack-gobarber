## Env

```
APP_URL=http://localhost:3333
NODE_ENV=development

# Auth

APP_SECRET=bootcampgobarbernode

# Database

DB_HOST=192.168.99.100
DB_USER=postgres
DB_PASS=docker
DB_NAME=gobarber

# Mongo

MONGO_URL=mongodb://192.168.99.100/gobarber

# Redis

REDIS_HOST=192.168.99.100
REDIS_PORT=6379

# Mail

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=9bb23299c01924
MAIL_PASS=fae8bad95408c8

# Sentry

SENTRY_DSN=https://cfd2ab3234b34e57968baa2241438054@sentry.io/1545597

```

## Docker - Postgres

`docker run --name gobarber -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres`

GUI => Postbird

## Docker - MongoDB

`docker run --name mongobarber -p 27017:27017 -d -t mongo`

GUI => MongoDB Compass

## Docker - Redis

`docker run --name redisbarber -p 6379:6379 -d -t redis:alpine`

### Docker - comandos

`docker ps -a` => lista todos os container existentes

`docker start CONTAINER_ID` => inicia o container especificado

## Migrations

Após a instalação dos container, crie um banco no postgres chamado `gobarber` e rode as migrations:

`yarn sequelize db:migrate`

## Run server

`yarn` => instalar dependências

`yarn dev` => roda o server principal

`yarn queue`=> roda o server das filas

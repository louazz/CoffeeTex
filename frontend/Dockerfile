FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./

COPY build .

RUN npm i -g serve

EXPOSE 3000

CMD ["serve","-s", "build"]
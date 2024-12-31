FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install -g --force yarn

RUN yarn install

COPY . .

RUN yarn build 

RUN npm i -g serve

EXPOSE 3000

CMD ["serve","-s", "build"]
FROM node:12-alpine

WORKDIR /usr/app

COPY package.json /usr/app

COPY yarn.lock /usr/app

RUN yarn

COPY . /usr/app

RUN yarn build

EXPOSE 3000

CMD yarn start

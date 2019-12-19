FROM node:alpine

RUN apk --update add git python make g++

RUN mkdir -p /usr/src/app
WORKDIR /urs/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

ENV NODE_PATH src
ENV NODE_ENV production
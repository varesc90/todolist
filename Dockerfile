FROM node:12.13.0-alpine

WORKDIR /usr
COPY package.json package-lock.json ./
RUN npm install --quiet
WORKDIR /usr/app

COPY . .
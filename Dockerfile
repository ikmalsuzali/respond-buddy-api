FROM node:18-alpine

ENV port=8080
COPY . .

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

COPY . .
COPY package*.json ./

RUN npm install -g ts-node

RUN apk add openssl1.1-compat
RUN yarn

EXPOSE 8080
CMD [ "yarn", "start" ]
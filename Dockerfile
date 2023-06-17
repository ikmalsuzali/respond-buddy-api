FROM node:18-alpine

ENV port=8090
COPY . .

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

RUN yarn
RUN yarn build

EXPOSE 8090
CMD [ "node", "./dist/main.js" ]
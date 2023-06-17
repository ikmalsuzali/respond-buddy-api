FROM node:18-alpine

ENV port=8090
COPY . .

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

RUN echo ${DATABASE_URL}

RUN apk add openssl1.1-compat
RUN npx prisma generate
RUN yarn
RUN yarn postinstall
RUN yarn install
RUN yarn build

EXPOSE 8090
CMD [ "node", "./dist/main.js" ]
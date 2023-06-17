FROM node:18-alpine

ENV port=8090
COPY . .

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

ARG SUPABASE_DATABASE_URL
ENV SUPABASE_DATABASE_URL=${SUPABASE_DATABASE_URL}

RUN echo ${SUPABASE_DATABASE_URL}

RUN apk add openssl1.1-compat
RUN yarn
RUN yarn install
RUN yarn start

EXPOSE 8090
CMD [ "node", "./dist/main.js" ]
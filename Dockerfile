FROM node:18-alpine

COPY . .

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

ARG ENVIRONMENT
ARG DATABASE_URL
ARG STRIPE_SECRET_DEMO
ARG STRIPE_WEBHOOK_DEMO
ARG STRIPE_SECRET_LIVE
ARG STRIPE_WEBHOOK_LIVE
ARG BASE_URL
ARG SLACK_WEBHOOK_URL
ARG SUPABASE_KEY
ARG SUPABASE_URL
ARG JWT_SECRET
ARG OPENAI_API_KEY
ARG S3_ENDPOINT
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG TELEGRAM_TOKEN
ARG DISCORD_TOKEN
ARG PORT

COPY package.json ./
COPY . .


RUN npm install -g ts-node

RUN apk add openssl1.1-compat
RUN yarn

EXPOSE PORT
CMD [ "yarn", "build" ]
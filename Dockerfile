FROM node:18-alpine

ENV port=8090
COPY . .

RUN yarn
RUN yarn build

EXPOSE 8090
CMD [ "node", "./dist/main.js" ]
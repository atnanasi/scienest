FROM node:13.1.0-alpine
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3000
CMD [ "node", "./dist/index.js" ]

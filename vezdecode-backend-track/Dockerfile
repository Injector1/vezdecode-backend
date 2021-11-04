FROM node:14.13.1-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn prisma generate

COPY ./dist ./dist

CMD ["yarn", "start"]
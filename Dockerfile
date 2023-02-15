FROM node:14

WORKDIR /app

COPY ./package.json /app

RUN npm install && npm cache clean --force

COPY . /app

ENV DEBUG false

ENV MONGODB_URL mongodb://mongo:27017

ARG NODE_ENV

ENV NODE_ENV ${NODE_ENV}

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
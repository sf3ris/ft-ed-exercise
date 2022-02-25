FROM node:14.18.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn install

EXPOSE 8081
CMD [ "yarn", "dev" ]

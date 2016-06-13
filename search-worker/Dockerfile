FROM node:6.2.1

MAINTAINER Mehmet Tamtürk

RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN rm -rf /src/node_modules
RUN npm install && npm run-script postinstall

CMD ["NODE_ENV=production", "npm", "start"]

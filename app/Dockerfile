FROM node:6.2.1

MAINTAINER Mehmet Tamtürk

RUN apt-get update -qq && apt-get install -y build-essential
RUN npm install gulp bower -g

# Create app directory
RUN mkdir /src
WORKDIR /src
COPY . /src

# Install app dependencies
RUN rm -rf /src/node_modules
RUN npm install
RUN bower install --allow-root
RUN gulp build

EXPOSE 3002

CMD [ "npm", "start" ]

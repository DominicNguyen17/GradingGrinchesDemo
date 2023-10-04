FROM node

RUN mkdir -p /usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8888

CMD [ "node", "./bin/www" ]
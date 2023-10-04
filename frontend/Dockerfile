FROM node:18

RUN mkdir -p /usr/src/app/frontend

WORKDIR /usr/src/app/frontend

COPY package.json ./

RUN npm install --verbose

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
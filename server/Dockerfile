FROM node:14

WORKDIR /usr/apiserver

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["node", "src/index.js"]
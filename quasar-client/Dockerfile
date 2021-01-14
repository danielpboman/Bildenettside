FROm node AS buildenv

WORKDIR /generator

COPY package*.json .

RUN yarn global add @quasar/cli
COPY . .

RUN yarn



RUN quasar build

###

FROM nginx
COPY --from=buildenv /generator/dist/spa /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

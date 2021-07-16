FROM node

WORKDIR /src

ADD packages/api/package.json /src

RUN npm i --silent

ADD packages/api /src

RUN npm run build

CMD npm start

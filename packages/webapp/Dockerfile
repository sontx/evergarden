FROM node:16 AS development

WORKDIR "/app"

COPY lerna.json .
COPY package*.json ./
COPY packages/webapp/package*.json ./packages/webapp/
COPY packages/shared/package*.json ./packages/shared/

RUN npm i

COPY wait-for-it.sh .

EXPOSE 4000

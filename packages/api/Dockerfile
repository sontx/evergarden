FROM node:16 AS development

WORKDIR "/app"

COPY lerna.json .
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/shared/package*.json ./packages/shared/

RUN npm i

COPY wait-for-it.sh .

EXPOSE 3000

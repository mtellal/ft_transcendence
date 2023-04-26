#LOCAL DEVELOPMENT

FROM node:19-alpine AS dev

RUN mkdir -p /usr/src/app

RUN chmod -R 777 /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

COPY ./scripts/dev-entrypoint.sh /usr/local/bin/

RUN ["chmod", "+x", "/usr/local/bin/dev-entrypoint.sh"]

USER node

ENTRYPOINT ["dev-entrypoint.sh"]

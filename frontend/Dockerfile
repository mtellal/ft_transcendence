#LOCAL DEVELOPMENT

FROM node:19-alpine AS dev

RUN mkdir -p /usr/src/app

RUN chmod -R 777 /usr/src/app

COPY ./scripts/entrypoint.sh /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

WORKDIR /usr/src/app

COPY package*.json ./

ENTRYPOINT ["entrypoint.sh"]

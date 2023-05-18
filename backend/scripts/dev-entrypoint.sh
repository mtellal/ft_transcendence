#!/bin/sh
set -e

npm install

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

npx prisma migrate dev

exec "$@"

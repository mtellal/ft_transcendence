#!/bin/sh

set -e 
npm i
#npm start  

npm install -g serve
npm run build
serve -s build -l 8080

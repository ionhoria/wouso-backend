#!/bin/bash

set +x

server=$1

if [ -z "$server" ]; then server="th"; fi 

rm backend.zip

zip backend.zip -r activity apps config db index.js local_apps logger package.json session setup.js "users" utils

scp backend.zip "$server":

ssh "$server" unzip -o backend.zip -d backend

ssh "$server" "cd backend; npm install"

ssh "$server" "cp config.js backend/config/index.js"

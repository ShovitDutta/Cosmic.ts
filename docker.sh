#!/bin/sh
yarn start &
echo "Waiting for Next.js applications to start..."
sleep 5
echo "Starting Nginx..."
nginx -g 'daemon off;'
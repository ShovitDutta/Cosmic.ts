FROM node:24-alpine
WORKDIR /app
COPY . .
ENV DATABASE_URL="file:./local.db"
RUN apk update && apk add --no-cache wget unzip curl nginx && rm -rf /var/cache/apk/*
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD nginx -c /app/nginx.conf & \
    yarn start & \
    sleep 10 && \
    (netstat -tulnp || ss -tulnp) && \
    ps aux
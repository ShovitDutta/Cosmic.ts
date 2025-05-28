FROM node:24-alpine
WORKDIR /app
COPY . .
ENV DATABASE_URL="file:./local.db"
RUN apk update && apk add --no-cache wget unzip curl nginx && rm -rf /var/cache/apk/*
RUN yarn install
RUN yarn build
COPY nginx.conf .
EXPOSE 8000
CMD nginx -c ./nginx.conf && yarn start

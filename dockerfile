FROM node:24-alpine
WORKDIR /app
ENV DATABASE_URL="file:./local.db"
RUN yarn config set registry https://registry.npmjs.org
RUN apk update && apk add --no-cache wget unzip curl nginx && rm -rf /var/cache/apk/*
COPY . .
EXPOSE 8000
RUN yarn install
RUN yarn run build
RUN yarn global add concurrently
CMD ["concurrently", "nginx -c /app/nginx.conf", "yarn start"]

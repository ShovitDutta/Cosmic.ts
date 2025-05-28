FROM node:24-alpine
WORKDIR /app
RUN npm config set strict-ssl false
RUN npm config set registry http://registry.npmjs.org
ENV DATABASE_URL="file:./local.db"
RUN apk update && apk add --no-cache wget unzip curl nginx && rm -rf /var/cache/apk/*
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 80 8000 3001 3002
CMD nginx -c /app/nginx.conf && yarn start
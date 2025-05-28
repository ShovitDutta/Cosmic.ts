FROM node:24-alpine
WORKDIR /app
ENV DATABASE_URL="file:./local.db"
RUN yarn config set registry https://registry.npmjs.org
RUN apk update && apk add --no-cache wget unzip curl nginx && rm -rf /var/cache/apk/*
COPY . .
RUN yarn install
RUN yarn run build
RUN chmod +x /app/entry.sh
EXPOSE 80 8000 3001 3002
CMD ["entry.sh"]
FROM node:24-alpine
WORKDIR /app
RUN npm config set registry https://registry.npmjs.org
RUN apk update && apk add --no-cache wget unzip curl nginx && rm -rf /var/cache/apk/*
COPY . .
RUN yarn install
RUN yarn run build
EXPOSE 80 8000 3001 3002
RUN chmod +x /app/docker.sh
CMD ["/bin/sh", "/app/docker.sh"]
FROM node:24-alpine
WORKDIR /app
COPY . .
RUN apk update && apk add --no-cache wget unzip curl rm -rf /var/cache/apk/*
RUN yarn install
RUN yarn build
EXPOSE 3001 3002
EXPOSE 9050 9051
CMD ["yarn", "start"]
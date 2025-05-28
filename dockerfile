FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
FROM node:24-alpine
WORKDIR /app
RUN apk update && \
    apk add --no-cache \
    wget \
    unzip \
    curl \
    rm -rf /var/cache/apk/*
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
ENV PATH="/usr/local/bin:$PATH"
EXPOSE 3001 3002
EXPOSE 9050 9051
CMD ["yarn", "start"]
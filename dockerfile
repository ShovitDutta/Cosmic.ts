FROM node:24-alpine
RUN apk add --no-cache nginx supervisor bun
WORKDIR /app
ENV NODE_OPTIONS=--no-deprecation
COPY . .
EXPOSE 8000
RUN chmod -R +x /app
RUN bun install --frozen-lockfile
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
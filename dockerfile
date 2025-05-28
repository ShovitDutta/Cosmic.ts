FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app
COPY . /app
RUN apt update && apt install -y wget unzip curl tor python3 python3-pip python3-venv nodejs npm && apt autoremove -y && apt clean && rm -rf /var/lib/apt/lists/*
RUN npm install -g n && n install 24
ENV PATH="/usr/local/bin:$PATH"
RUN npm install -g yarn
RUN yarn install && yarn build
EXPOSE 3001 3002
EXPOSE 9050 9051
CMD ["yarn", "start"]
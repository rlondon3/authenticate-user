FROM node:alpine@sha256:d3a3d691797cef0b70e361788a2aeb9dd7925112996719628d4bcd4bd27009b0
COPY . /app
WORKDIR /app/src
RUN deluser --remove-home node
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node
RUN npm install
COPY package*.json .
EXPOSE 5001
CMD ["node", "server.js"]
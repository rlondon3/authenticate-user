FROM node:alpine@sha256:a67a33f791d1c86ced985f339fa160f6188f590ebbe963fe11cc00adc971fa41
COPY . /app
WORKDIR /app/src
RUN deluser --remove-home node
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node
RUN npm install
COPY package*.json .
EXPOSE 5001
CMD ["node", "server.js"]
FROM alpine:latest

ENV HTTP_PORT=3000
ENV HTTPS_PORT=3001

EXPOSE ${HTTP_PORT}
EXPOSE ${HTTPS_PORT}

RUN apk add openssl
RUN apk add --update nodejs npm

WORKDIR /usr/src/app

COPY ./src .

# NOT FOR PRODUCTION USE. Ideally these cert files would be in a secure storage.
# Note CN is localhost here
RUN  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./certs/selfsigned.key -out ./certs/selfsigned.crt -subj '/CN=localhost'

RUN npm install

CMD ["npm", "run", "start"]
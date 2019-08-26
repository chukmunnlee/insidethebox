FROM node:latest

ENV APP_DIR=/app APP_PORT=3000

WORKDIR ${APP_DIR}

ADD main.js .
ADD package.json .
ADD package-lock.json .

ADD public public
ADD views views

RUN npm install --production

HEALTHCHECK --interval=15s --timeout=10s \
	CMD curl -s -f http://localhost:${APP_PORT}/health || exit 1

EXPOSE ${APP_PORT}

ENTRYPOINT [ "node", "main.js" ]

CMD [ "" ]

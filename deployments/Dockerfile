FROM node:latest as build_env

ENV APP_ROOT=/app
ENV FE_DIR=${APP_ROOT}/frontend BE_DIR=${APP_ROOT}/backend

WORKDIR ${APP_ROOT}

ADD config.json .
ADD common common

# build the frontend

WORKDIR ${FE_DIR}

ADD frontend/angular.json .
ADD frontend/browserslist .
ADD frontend/package.json .
ADD frontend/package-lock.json .
ADD frontend/tsconfig.app.json .
ADD frontend/tsconfig.json .

ADD frontend/src src

RUN cd ${FE_DIR} \
	&& npm install \
	&& ./node_modules/.bin/ng build --prod 

# build the backend

WORKDIR ${BE_DIR}

ADD backend/nest-cli.json .
ADD backend/package.json .
ADD backend/package-lock.json .
ADD backend/tsconfig.build.json .
ADD backend/tsconfig.json .

ADD backend/src src

RUN cd ${BE_DIR} \
	&& npm install \
	&& npm run build

FROM node:latest

ENV APP_ROOT=/app APP_PORT=3000
ENV FE_DIR=${APP_ROOT}/frontend BE_DIR=${APP_ROOT}/backend

WORKDIR ${APP_ROOT}

ADD common common
ADD config.json .

COPY --from=build_env ${FE_DIR}/dist ${FE_DIR}/dist

WORKDIR ${BE_DIR}

ADD backend/package.json .
ADD backend/package-lock.json .

COPY --from=build_env ${BE_DIR}/dist ${BE_DIR}/dist

RUN npm install --production

HEALTHCHECK --interval=1m --timeout=10s \
	CMD curl -fs http://localhost:${APP_PORT}/admin/health || exit 1

EXPOSE ${APP_PORT}

ENTRYPOINT [ "npm", "run", "start:prod" ]

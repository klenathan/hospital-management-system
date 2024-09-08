FROM node:20-alpine as frontend_build

WORKDIR /app

COPY ./frontend/package.json yarn.lock ./

RUN yarn install

COPY ./frontend ./.env .

RUN yarn build

FROM node:20-alpine as backend_build

WORKDIR /app

COPY ./backend/package.json yarn.lock ./

RUN yarn install

COPY ./backend ./.env ./

RUN yarn tsc && \
    rm -r ./src/**/*.ts

FROM node:20-alpine as prod

WORKDIR /app

COPY --from=frontend_build /app/dist /app/frontend/dist
COPY --from=frontend_build /app/package*.json /app/frontend/

COPY --from=backend_build /app/ /app/backend/

COPY ./.env /app/

EXPOSE 3000

CMD ["node", "./backend/src/index.js"]

FROM node:20-alpine as frontend-build

WORKDIR /app

COPY ./frontend/package.json yarn.lock ./

RUN yarn install

COPY ./frontend .

RUN yarn build

FROM node:20-alpine as backend-build

WORKDIR /app

COPY --from=frontend-build /frontend/node_modules ./node_modules
COPY --from=frontend-build /frontend/dist ./dist
COPY --from=frontend-build /frontend/package*.json ./

COPY ./backend/package.json yarn.lock ./

RUN yarn install

COPY ./backend .

RUN yarn tsc && \
    rm -r ./src/**/*.ts

EXPOSE 3000

CMD ["node", "./src/index.js"]

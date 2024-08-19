FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn tsc && \
    rm -r ./src/**/*.ts

EXPOSE 3000

# Define the command to run the application
CMD ["node", "./src/index.js"]
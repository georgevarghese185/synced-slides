FROM node:14.16.0-alpine3.10 AS builder

COPY package.json yarn.lock /app/source/
COPY frontend/package.json frontend/yarn.lock /app/source/frontend/
WORKDIR /app/source
RUN yarn install --prod && \
    cd frontend && \
    yarn install

COPY . .
RUN cd frontend && yarn build

RUN mkdir /app/build
RUN cp -R dist node_modules server package.json sequelize-cli.config.js yarn.lock /app/build/

FROM node:14.16.0-alpine3.10

WORKDIR /app
COPY --from=builder /app/build .

EXPOSE 80
ENV PORT=80
CMD sh -c "yarn sequelize db:migrate && yarn start:prod"

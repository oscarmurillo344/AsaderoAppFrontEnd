FROM node:16-alpine3.17 as node
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build --prod

FROM nginx:1.22.1-alpine
COPY --from=node /app/dist/asadero-front-end-dev14 /usr/share/nginx/html



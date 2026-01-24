FROM nginx:alpine-slim

COPY dist /usr/share/nginx/html/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

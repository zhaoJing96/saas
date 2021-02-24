FROM docker.io/nginx
COPY ./bundle /usr/share/nginx/html/
EXPOSE 80

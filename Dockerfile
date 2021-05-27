FROM nginx:1.19.0-alpine
COPY ./dist /var/www
COPY ./www /var/www
COPY ./nginx /etc/nginx
EXPOSE 443
ENTRYPOINT ["nginx","-g","daemon off;"]

# syntax=docker/dockerfile:1
FROM caddy:2-alpine

# To run the image on a ARM based machine, use this line. Plese do not commit this line.
#FROM arm64v8/caddy:2-alpine

LABEL org.opencontainers.image.description="Famulex UI Web"
LABEL org.opencontainers.image.authors="Coduction Software - info@coduction.com"

COPY apps/famulex-ui-web/deployment/Caddyfile /etc/caddy/Caddyfile
ADD dist/apps/famulex-ui-web /var/www/html

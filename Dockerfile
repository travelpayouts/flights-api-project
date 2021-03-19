FROM php:7.4-apache

RUN a2enmod rewrite

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY . /var/www/html

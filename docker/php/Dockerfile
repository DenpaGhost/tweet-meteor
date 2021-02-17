FROM php:8-apache

RUN apt-get -y update \
    && apt-get install -y libpq-dev libzip-dev zlib1g-dev vim \
    apt-utils apt-transport-https libpcre3 \
    libpcre3-dev ca-certificates curl unzip gnupg

RUN docker-php-ext-install pdo_pgsql  mysqli zip

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN composer global require "laravel/installer"
ENV PATH $PATH:/root/.composer/vendor/bin

COPY php.ini /usr/local/etc/php/
COPY apache.conf /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod rewrite

# flights-api-project

This is a standalone app based on [Yii2](http://www.yiiframework.com/) on backend and [angularJs](https://angularjs.org/) on frontend. It use [Travelpayouts api](https://support.travelpayouts.com/hc/en-us/categories/200358578) for retrieving flights information and view search results on a domain or subdomain of your site. 

#### [Check out our demo](http://misc.travelpayouts.com/flights/)

## Requirements
This app using [Travelpayouts flights search API](https://www.travelpayouts.com/developers/api), to access the flights search API you should be registered in our travel affiliate program and submit your request on [support@travelpayouts.com](mailto:support@travelpayouts.com) with the following information:

* URL of your website;
* Design prototypes of search result;
* Description of your project;
* How you will use the search API?
* Why aren’t the standard methods of integration ([search forms](https://support.travelpayouts.com/hc/en-us/articles/203638588-Search-form), [White Label](https://support.travelpayouts.com/hc/en-us/categories/115000474487), [API access to data](https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API)) suitable for you. 

**[More information about flights search api](https://support.travelpayouts.com/hc/en-us/categories/200358578)**

After granting access to [Travelpayouts flight search Api](https://support.travelpayouts.com/hc/en-us/sections/200989107-Flights-search-API) you need to get your **api token** and **marker** [here](https://www.travelpayouts.com/developers/api).

![](https://habrastorage.org/web/b53/770/96e/b5377096e4dc473ba09ad67b21c8d198.png)


## Installation

Download and unzip package or clone it to your web folder `git clone https://github.com/travelpayouts/flights-api-project.git`

Use [composer](https://getcomposer.org/) to install dependencies.

###Installing Composer

If you do not already have Composer installed, you may do so by following the instructions at getcomposer.org. On Linux and Mac OS X, you'll run the following commands

```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```
On Windows, you'll download and run [Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe).

### Installing Composer packages
Just use command `composer install`.

### Changing your app parameters
Before first running of your app you need to set app params. All your params is located in **config/params.php**

```
return [
    'adminEmail' => 'admin@example.com',
    'apiToken'=> '', // Token https://www.travelpayouts.com/developers/api
    'apiMarker'=> '', // Marker https://www.travelpayouts.com/developers/api
    'apiResponseLang'=> 'en', // Response language : en,ru,de,es,fr,it,pl,th.
    'title'=> 'TravelPayouts sample app', // Title of your app
    'baseUrl'=> '/flights-api-project' // Path of your app (for example: if your project url is http//site.com/flight set 'baseUrl'=> '/flights', if it in root directory set 'baseUrl'=> '/'
];
```

### Setting webserver 
* [Apache HTTP server](http://httpd.apache.org/) users have all needed .htaccess files out of box. 
* [Nginx HTTP server](http://nginx.org/) users should install PHP as an [FPM SAPI](http://php.net/install.fpm). You may use the following Nginx configuration, replacing `path/to/basic/web` with the actual path for `basic/web` and `mysite.local` with the actual hostname to serve.

```
server {
    charset utf-8;
    client_max_body_size 128M;

    listen 80; ## listen for ipv4
    #listen [::]:80 default_server ipv6only=on; ## listen for ipv6

    server_name mysite.local;
    root        /path/to/basic/web;
    index       index.php;

    access_log  /path/to/basic/log/access.log;
    error_log   /path/to/basic/log/error.log;

    location / {
        # Redirect everything that isn't a real file to index.php
        try_files $uri $uri/ /index.php$is_args$args;
    }

    # uncomment to avoid processing of calls to non-existing static files by Yii
    #location ~ \.(js|css|png|jpg|gif|swf|ico|pdf|mov|fla|zip|rar)$ {
    #    try_files $uri =404;
    #}
    #error_page 404 /404.html;

    # deny accessing php files for the /assets directory
    location ~ ^/assets/.*\.php$ {
        deny all;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass 127.0.0.1:9000;
        #fastcgi_pass unix:/var/run/php5-fpm.sock;
        try_files $uri =404;
    }

    location ~* /\. {
        deny all;
    }
}
```

### When all this things is done
Congratulations, you completed installation and you can perform your first search.

![](https://habrastorage.org/web/fff/3a7/1b2/fff3a71b28f040ec911f448a3d460933.png)

## Developing

### Dependencies
What you need to make changes to this app:

* [node](https://nodejs.org/) and npm
* Ensure you're running Node **(v6.x.x+)** and NPM **(3.x.x+)**

### Installing packages
Use command `npm install` to install all package dependencies

### [Webpack](https://webpack.github.io/)
Use webpack to make changes to all files that you want to change.
To recompile your frontend files you can use command: `webpack` in root directory of your project or `webpack -w` if you don’t want to manually recompile after every change.

### Frontend directory structure
Category | Location
------------ | -------------
Webpack config | `/webpack.config.js`
Angular app entry point | `/frontend/app.js`
Components  | `/frontend/components`
Controllers  | `/frontend/controllers`
Templates |  `/web/templates`
Stylesheets (scss) |  `/frontend/scss`



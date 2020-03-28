# server-side-rendering
This project is server side rendering sample that is implemented with NodeJS for server side and React for client side.

## Features
- by client with react, not used CRA. instead, implemented with webpack and babel
- implemented caching system with lru-cache module. So, if you request each pages more than twice, it will return the page in the cache.
- There is an pre-render system implemented.

## Install
```bash
$ git clone https://github.com/danivelop/server-side-rendering.git
$ cd server-side-rendering
$ npm install
$ npm build
```
Next, run `npm run start` on your terminal and go to the `http://localhost:3000`. You'll see the page rendered on server.

import express from 'express';
import fs from 'fs';
import path from 'path';
import * as url from 'url';
import lruCache from 'lru-cache';
import { renderPage, prerenderPages } from './common';

const ssrCache = new lruCache({
  max: 100,
  maxAge: 1000 * 60
});

const app = express();

const prerenderHtml = {};
for (const page of prerenderPages) {
  const pageHtml = fs.readFileSync(
    path.resolve(__dirname, `../dist/${page}.html`),
    'utf8'
  );
  prerenderHtml[page] = pageHtml;
}

app.use('/dist', express.static('dist'));
app.get('/favicon.ico', (req, res) => res.sendStatus(204));
app.get('*', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const cacheKey = parsedUrl.path;
  if (ssrCache.has(cacheKey)) {
    console.log('캐시 사용');
    return res.send(ssrCache.get(cacheKey));
  }
  const page = parsedUrl.pathname === '/' ? 'home' : parsedUrl.pathname.substr(1);
  const initialData = { page };
  const pageHtml = prerenderPages.includes(page) ? prerenderHtml[page] : renderPage(page);
  const result = pageHtml.replace(
    '__DATA_FROM_SERVER__',
    JSON.stringify(initialData)
  );
  ssrCache.set(cacheKey, result);
  res.send(result);
});

app.listen(3000);
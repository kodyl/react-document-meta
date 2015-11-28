import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Root from '../components/root';
import Nested from '../components/nested';
import DocumentMeta from '../../lib';

const server = express();

function ssr ( res, content ) {
  const meta = DocumentMeta.renderAsHTML();

  res.send(`<html>
  <head>
    ${meta}
  </head>
  <body>
    <div id='root'>${content}</div>
  </body>
  <script src="/bundle.js"></script>
</html>`);
}

server.get('/', (req, res) => {
  ssr(res, ReactDOMServer.renderToString(<Root />));
});

server.get('/nested', (req, res) => {
  ssr(res, ReactDOMServer.renderToString(<Root><Nested /></Root>));
});

server.listen(9001);

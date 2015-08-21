import express from 'express';
import compressor from 'compression';
import parser from 'body-parser';
import cookies from 'cookie-parser';
import path from 'path';

import logger from 'morgan';
import fs from 'fs';
import httpProxy from 'http-proxy';

import config from 'config/server';
import renderer from './libs/renderer';

const app = express();

if (config.env === 'production') {
  let logStream = fs.createWriteStream(`${process.cwd()}/log/server.log`, { flags: 'a' });
  app.use(logger('combined', { stream: logStream }));
} else {
  app.use(logger('dev'));
}

app.use(compressor());
app.use(parser.urlencoded({ extended: true }));
app.use(cookies());

app.use(express.static(path.join(process.cwd(), 'public')));

const proxy = httpProxy.createProxyServer({
  target: config.apiEndpoint
});

app.use('/api', (req, res) => {
  proxy.web(req, res);
});

app.use('/', renderer);

app.set('port', config.appPort);

app.listen(app.get('port'), function() {
  console.log(`=> 🚀  Express ${config.bundle} ${config.env} server is running on port ${this.address().port}`);  // eslint-disable-line no-console
});

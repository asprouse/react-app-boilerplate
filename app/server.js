import express      from 'express';
import compressor   from 'compression';
import parser       from 'body-parser';
import cookies      from 'cookie-parser';
import path         from 'path';

import logger       from 'morgan';
import fs           from 'fs';
import httpProxy    from 'http-proxy';

import config             from 'config/server';
import initter            from './libs/initters/server';
import getAsset           from './libs/getAsset';
import setCookieDomain    from './libs/setCookieDomain';
import routes             from './routes/routes';
import reducers           from './reducers/reducers';
import Head               from './layouts/Head';
import * as AuthActions   from './actions/AuthActions';

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__    = config.env !== 'production';

function serve(req, res, next) {

  const { bundle, facebookAppId } = config;

  const cookieDomain = setCookieDomain(req.headers.host);

  const params = {
    bundle,
    routes,
    reducers,
    Head,
    AuthActions,
    cookieDomain,
    facebookAppId,
    locals: {
      jsAsset    : getAsset(bundle, 'js'),
      cssAsset   : getAsset(bundle, 'css'),
      vendorAsset: getAsset('vendor', 'js')
    }
  };

  initter(req, res, next, params);
}


const app = express();

const appEnv = app.get('env');

if (appEnv === 'production') {
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
  target: 'http://localhost:' + config.apiPort
});

app.use('/api', (req, res) => {
  proxy.web(req, res);
});

app.use('/', serve);

app.set('port', config.appPort);

app.listen(app.get('port'), function() {
  console.log(`=> 🚀  Express ${config.bundle} ${config.env} server is running on port ${this.address().port}`);  // eslint-disable-line no-console
});

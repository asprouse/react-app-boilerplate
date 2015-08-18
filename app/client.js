import polyfill         from 'babel/polyfill';  // eslint-disable-line no-unused-vars
import styles from './styles/main.styl'; // eslint-disable-line no-unused-vars

import config           from 'config/server';
import initter          from './libs/initters/client';
import setCookieDomain  from './libs/setCookieDomain';
import routes           from './routes/routes';
import reducers         from './reducers/reducers';
import meta             from './layouts/meta';


const cookieDomain = setCookieDomain(document.location.hostname);

const { googleAnalyticsId } = config;

const params = { routes, reducers, meta, cookieDomain, googleAnalyticsId };

export default initter(params);

/* eslint no-var: 0, vars-on-top: 0 */

require('babel/register')({
  extensions: ['.js', '.jsx'],
  stage: 0
});

var config = require('config/server');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = config.env !== 'production';

require('./app/server');

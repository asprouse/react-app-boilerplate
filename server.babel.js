/* eslint no-var: 0 */

require('babel/register')({
  extensions: ['.js', '.jsx'],
  stage     : 0
});

require('./app/server');

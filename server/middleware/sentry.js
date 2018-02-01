var Raven = require('raven');
Raven.config('https://66bff354602649099aacf516e03836b4:b43e1dc613544009a1c1b6ebff4254cb@sentry.io/281436').install();

module.exports = function () {
  return Raven.errorHandler();
}
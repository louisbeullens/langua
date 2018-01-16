'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.get('/crash', function(req,res) {
    process.exit(1);
  });
  server.use(router);
};

'use strict';

var loopback = require('loopback');
var path = require('path');

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  router.get('/crash', function (req, res) {
    process.exit(1);
  });

  router.post('/faq/askQuestion', function (req, res) {
    if (req.body.email !== '' && req.body.firstname !== '' && req.body.message !== '') {
      const template = loopback.template(path.resolve(path.join(__dirname, '..', 'templates', 'ask-question.ejs')));
      const html = template({
        firstname: req.body.name
      });
      server.models.Email.send({
        to: req.body.email,
        from: 'noreply@Langua.be',
        subject: 'gestelde vraag',
        html: html
      }, function (err, result) {
        if (err) {
          return res.send(JSON.stringify({ status: 'error' }));
        }

        server.models.Email.send({
          to: ['Peter@Langua.be','Louis@Langua.be'],
          from: req.body.email,
          subject: 'vraagje',
          html: '<body><pre>' + req.body.message + '</pre></body>'
        }, function (err, result) {
          if (err) {
            res.send(JSON.stringify({ status: 'error' }));
            console.log(err);
          } else {
            res.send(JSON.stringify({ status: 'ok' }));
          }
        });
      });
    } else {
      res.send(JSON.stringify({ status: 'error' }));
    }
  });

  server.use(router);
};

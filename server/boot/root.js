'use strict';

var loopback = require('loopback');
var path = require('path');

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();

  router.post('/faq/askQuestion', function (req, res) {
    if (req.body.email !== '' && req.body.firstname !== '' && req.body.message !== '') {

      server.datasources.ReCaptcha.findById(req.body.grecaptchaResponse, function (err, result) {
        result = JSON.parse(result);
        if (result.success) {

          const template = loopback.template(path.resolve(path.join(__dirname, '..', 'templates', 'ask-question.ejs')));
          const html = template({
            name: req.body.name
          });
          server.models.Email.send({
            to: req.body.email,
            from: 'noreply@Langua.be',
            subject: 'gestelde vraag op Langua.be',
            html: html
          }, function (err, result) {
            if (err) {
              console.log(err);
              return res.send(JSON.stringify({ status: 'error' }));
            }

            var subject = 'vraagje';

            if (req.body.location === 'landing') {
              subject = 'Vraag van ' + req.body.name + ' via Langua landingpage'
            }

            server.models.Email.send({
              to: ['Peter@Langua.be', 'Louis@Langua.be'],
              from: req.body.email,
              subject: subject,
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
    }
  });

  server.use(router);
};

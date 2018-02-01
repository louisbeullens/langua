'use strict';

var isEmail = require('isemail');
var crypto = require('crypto');

module.exports = function (MailingList) {

  MailingList.validate('email', emailValidator, {
    message: 'Must provide a valid email'
  });
  MailingList.validatesUniquenessOf('email', {
    message: 'email already in mailingList',
  });

  function emailValidator(err, done) {
    var value = this.email;
    if (value == null)
      return;
    if (typeof value !== 'string')
      return err('string');
    if (value === '') return;
    if (!isEmail.validate(value))
      return err('email');
  }

  MailingList.beforeRemote('create', function (ctx, unused, next) {
    console.log('mailinglist before create');
    if (ctx.req.body.grecaptchaResponse) {
      MailingList.app.datasources.ReCaptcha.findById(ctx.req.body.grecaptchaResponse, function (err, result) {
          if (err) {
            console.log(err);
            next(err);
          }
          if (result.success === true) {
            next();
          } else {
            console.log('result in fail', result);
            next(new Error('recaptcha response unsuccessfull'));
          }
      });
    } else {
      next(new Error('recaptcha response cannot be empty'));
    }
  });

  MailingList.observe('before save', function (ctx, next) {
    if (ctx.isNewInstance) {
      crypto.randomBytes(32, function (err, buf) {
        if (buf) {
          ctx.instance.unsubscribeToken = buf.toString('hex');
          next();
        } else {
          next(err);
        }
      });
    }
  });
};

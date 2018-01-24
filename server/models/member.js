'use strict';

var app = require('../../server/server');

var config = require('../../server/config.json');
var path = require('path');

var loopback = require('loopback');

var privateSettings = require('../private-settings');

module.exports = function (Member) {

    delete Member.validations.username;

    Member.getVerifyOptions = function () {
        const defaultOptions = {
            type: 'email',
            from: 'registratie@Langua.be',
            subject: 'Welkom bij Langua',
            protocol: privateSettings.protocol,
            host: privateSettings.host,
            port: privateSettings.port,
            redirect: privateSettings.redirect,
            template: path.join(__dirname, '..', 'templates', 'verify.ejs')
        };
        return Object.assign({}, this.settings.verifyOptions || defaultOptions);
    };

    Member.afterRemote('create', function(ctx, memberInstance, next) {
        Member.app.models.MailingList.create({email: memberInstance.email});
        const verifyOptions = Object.assign({}, Member.getVerifyOptions());
        verifyOptions.firstname = memberInstance.firstname;
        verifyOptions.lastname = memberInstance.lastname;
        memberInstance.verify(verifyOptions);
        next();
    });

    function logIpAddress(ctx, accessToken, next) {
        console.log('User with id: ' + accessToken.userId + ' logged in form ip: ' + ctx.req.ip);

        Member.app.datasources.FreeGeoIp.findById('84.196.187.163', function(err, freeGeoIp) {
            if (err) {
                return next(err);
            }

            freeGeoIp.memberId = accessToken.userId;

            Member.app.models.IpLocation.findOne({where: freeGeoIp}, function(err, result) {
                if (err) {
                    return next(err);
                }

                if (!result) {
                    Member.app.models.IpLocation.create(freeGeoIp, function(err) {
                        return next(err);
                    });
                } else {
                    return next(err);
                }
            });
        });
    }

    Member.afterRemote('login', logIpAddress);
    Member.afterRemote('anonymousLogin', logIpAddress);

    Member.emailExists = function (email, cb) {
        Member.findOne({where: {email: email}}, function (err, result) {
            cb(err, (result) ? true : false);
            return;
        });
    };

    Member.remoteMethod('emailExists', {
        accepts: [
            {arg: 'email', type: 'string', required: true}
        ],
        http: {path: '/:email/exists', verb: 'get'},
        returns: {type: 'boolean', root: true}
    });

    Member.anonymousLogin = function (req, cb) {

        console.log(req.ip);

        var rand = Math.floor(Math.random() * 10000).toString();
        var date = new Date(Date.now());
        rand = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString() + date.getUTCDate().toString() + '.' + date.getUTCHours().toString() + date.getUTCMinutes().toString() + date.getUTCSeconds().toString() + '.' + date.getUTCMilliseconds().toString() + '.' + rand;
        rand = rand + '@langua.be';
        Member.create({email: rand, password: rand, emailVerified:true}, function (err, newMember) {
            if (err)
                console.log(err);

            console.log(newMember);

            Member.login({email: newMember.email, password: newMember.email}, function (err, accessToken) {
                if (err)
                    console.log(err);

                console.log(accessToken);

                cb(null, accessToken)
            });
        });
        return;
    };

    Member.remoteMethod('anonymousLogin', {
        accepts: [{arg: 'req', type: 'object', 'http': {source: 'req'}}],
        http: {path: '/anonymousLogin', verb: 'get'},
        returns: {type: 'AccessToken', root: true}
    });

    Member.facebookLogin = function(fb_access_token, cb) {
        Member.app.datasources.Facebook.userData(fb_access_token, function(err, fBUser) {
            if (err) {
                return cb(err, null);
            }
            if (fBUser.email) {
                Member.findOne({where: {email: fBUser.email}}, function(err, member) {
                    if (err) {
                        return cb(err, null);
                    }
                    if (member) {
                        member.createAccessToken(14*24*3600, function(err,token) {
                            cb(err,token);
                        })
                    } else {
                        Member.create({email: fBUser.email, firstname: fBUser.first_name, lastname: fBUser.last_name, username: fBUser.name, password: facebook_access_token.slice(0,72), emailVerified: true}, function(err, member) {
                            if (err) {
                                return cb(err, null);
                            }
                            if (member) {
                                member.createAccessToken(14*24*3600, function(err,token) {
                                    cb(err,token);
                                })
                            } else {
                                cb(new Error("Something went wrong."), null);
                            }
                        });
                    }
                });
            } else {
                cb(new Error("Email permission not granted"), null);
            }
        });
    };

    Member.remoteMethod('facebookLogin', {
        accepts: [{arg: 'fb_access_token', type: 'string'}],
        http: {path: '/facebookLogin', verb: 'post'},
        returns: {type: 'AccessToken', root: true}
    });

    Member.getRoles = function(memberId, cb) {
        const sql = "SELECT DISTINCT Role.name FROM RoleMapping JOIN Role on RoleMapping.roleId=Role.id WHERE RoleMapping.principalType=? AND RoleMapping.principalId=?;";
        Member.app.datasources.langua.connector.execute(sql,[Member.app.models.RoleMapping.USER, memberId], function(err, results) {
            if (err) {
                return cb(err, null);
            }

            const roles = [];

            for (var i=0; i<results.length; i++) {
                roles.push(results[i].name);
            }

            cb(err, roles);
        });
    }

    Member.remoteMethod('getRoles', {
        accepts: [{arg: 'id', type: 'string'}],
        http: {path: '/:id/roles', verb: 'get'},
        returns: {type: '[string]', root: true}
    });

    Member.unfinishedTranslationTests = function (id, cb) {

        const sql = 'SELECT DISTINCT Test.id, Test.type, Test.lastQuestion, Test.numQuestions, Test.validAnswers, Test.languageAnswerId, Test.languageQuestionId FROM Test JOIN Question ON Question.testId=Test.id WHERE Test.memberId=? AND Test.type=? AND Test.lastQuestion!=Test.numQuestions AND Question.archivedAt IS NULL;';
        const params = [id, 'T'];

        Member.app.datasources.langua.connector.execute(sql, params, function (err, results) {
            if (err) {
                console.log(err);
                cb(err, []);
                return;
            }

            cb(null, results);
        });

    };

    Member.remoteMethod('unfinishedTranslationTests', {
        accepts: [
            {arg: 'id', type: 'number', required: true}
        ],
        http: {path: '/:id/unfinishedTranslationTests', verb: 'get'},
        returns: {type: '[Test]', root: true}
    });

    Member.unfinishedConjugationTests = function (id, cb) {

        const sql = 'SELECT DISTINCT Test.id, Test.type, Test.lastQuestion, Test.numQuestions, Test.validAnswers, Test.languageAnswerId, Test.languageQuestionId FROM Test JOIN Question ON Question.testId=Test.id WHERE Test.memberId=? AND Test.type=? AND Test.lastQuestion!=Test.numQuestions AND Question.archivedAt IS NULL;';
        const params = [id, 'C'];

        Member.app.datasources.langua.connector.execute(sql, params, function (err, results) {
            if (err) {
                console.log(err);
                cb(err, []);
                return;
            }

            cb(null, results);
        });

    };

    Member.remoteMethod('unfinishedConjugationTests', {
        accepts: [
            {arg: 'id', type: 'number', required: true}
        ],
        http: {path: '/:id/unfinishedConjugationTests', verb: 'get'},
        returns: {type: '[Test]', root: true}
    });

    Member.getResults = function(memberId, cb) {

        //Member.app.models.Question.find({where: {memberId: memberId}})

        const sql = "SELECT Sum(valid) AS correct, Count(valid) AS total, Test.type FROM Answer JOIN Question ON Answer.questionId=Question.id JOIN Test ON Question.testId=Test.id WHERE Question.memberId=? AND Question.archivedAt IS NULL GROUP BY Question.testId ORDER BY Question.testId DESC;";
        const params = [memberId];
        Member.app.datasources.langua.connector.execute(sql, params, function(err, results) {
            if (err) {
                return cb(err);
            }

            const lastTest = {correct:0, incorrect:0, total:0, numTests: 0};
            const conjugationTests = {correct:0, incorrect:0, total:0, numTests: 0};
            const translationTests = {correct:0, incorrect:0, total:0, numTests: 0};
            const allTests = {correct:0, incorrect:0, total:0, numTests:0};

            if (results.length > 0) {
                lastTest.correct = results[0].correct;
                lastTest.incorrect = (results[0].total - results[0].correct);
                lastTest.total = results[0].total;
                lastTest.numTests = 1;
            }

            for (var i=0;i<results.length; i++) {

                if (results[i].type === 'C') {
                    conjugationTests.correct += results[i].correct;
                    conjugationTests.incorrect += (results[i].total - results[i].correct);
                    conjugationTests.total += results[i].total;
                    conjugationTests.numTests++;
                } else {
                    translationTests.correct += results[i].correct;
                    translationTests.incorrect += (results[i].total - results[i].correct);
                    translationTests.total += results[i].total;
                    translationTests.numTests++;
                }

                allTests.correct += results[i].correct;
                allTests.incorrect += (results[i].total - results[i].correct);
                allTests.total += results[i].total;
                allTests.numTests++;
            }

            const result = {lastTest: lastTest, conjugationTests: conjugationTests, translationTests: translationTests, allTests: allTests};

            cb(null, result);
        });
    };

    Member.remoteMethod('getResults', {
        accepts: [
            {arg: 'id', type: 'number', required: true}
        ],
        http: {path: '/:id/results', verb: 'get'},
        returns: {type: {lastTest: 'Object'}, root: true}
    });

    Member.resetResults = function(memberId, type, cb) {
        Member.app.models.Question.updateAll({and: [{memberId: memberId}, {archivedAt: null}]}, {archivedAt: Date.now()}, function(err) {
           cb(null,true);
        });
    };

    Member.remoteMethod('resetResults', {
        accepts: [
            {arg: 'id', type: 'number', required: true},
            {arg: 'type', type: 'string'}
        ],
        http: {path: '/:id/resetResults', verb: 'get'},
        returns: {type: 'boolean', root: true}
    });

    Member.on('resetPasswordRequest', function(info) {
        const template = loopback.template(path.resolve(path.join(__dirname,'..','templates','password-reset.ejs')));
        const html = template({
            token: info.accessToken.id,
            verifyHref: privateSettings.protocol + '://' + privateSettings.frontend + '/password/reset?token='+info.accessToken.id,
            firstname: info.user.firstname,
            lastname: info.user.lastname
        });
        Member.app.models.Email.send({
            to: info.email,
            from: 'noreply@langua.be',
            subject: 'Wachtwoord vergeten',
            html: html
        }, function(err, result) {
            if (err) {
                console.log(err);
            }
        });
    });
};

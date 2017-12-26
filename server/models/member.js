'use strict';

var app = require('../../server/server');
const http = require('http');

var config = require('../../server/config.json');
var path = require('path');


module.exports = function (Member) {

    delete Member.validations.username;

    Member.getVerifyOptions = function () {
        const defaultOptions = {
            type: 'email',
            from: 'registratie@langua.be',
            host: '192.168.0.139',
            redirect: 'http://192.168.0.139:4200/'
        };
        return Object.assign({}, this.settings.verifyOptions || defaultOptions);
    };

    Member.afterRemote('create', function(ctx, memberInstance, next) {
        memberInstance.verify(Member.getVerifyOptions());
        next();
    });

    function logIpAddress(ctx, accessToken, next) {
        console.log('User with id: ' + accessToken.userId + ' logged in form ip: ' + ctx.req.ip);

        http.get('http://freegeoip.net/json/84.196.187.163', function (res) {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];

            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', function (chunk) {
                rawData += chunk;
            });
            res.on('end', function () {
                var ipLocation = JSON.parse(rawData);
                ipLocation.memberId = accessToken.userId;
                app.models.IpLocation.findOne({
                    where: {
                        and: [
                            {ip: ipLocation.ip},
                            {memberId: accessToken.userId},
                            {latitude: ipLocation.latitude},
                            {longitude: ipLocation.longitude}
                        ]
                    }
                }, function (err, result) {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (!result) {
                        app.models.IpLocation.create(ipLocation, function (err) {
                            if (err)
                                console.log(err);
                        });
                    }
                })
            });
        });
        next();
    }

    Member.afterRemote('login', logIpAddress);
    Member.afterRemote('anonymousLogin', logIpAddress);

    Member.emailExists = function (email, cb) {
        Member.findOne({where: {email: email}}, function (err, result) {
            cb(err, (result) ? true : false);
            return;
        });
    }

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
    }

    Member.remoteMethod('anonymousLogin', {
        accepts: [{arg: 'req', type: 'object', 'http': {source: 'req'}}],
        http: {path: '/anonymousLogin', verb: 'get'},
        returns: {type: 'AccessToken', root: true}
    });

    Member.unfinishedTests = function (id, cb) {

        const sql = 'SELECT DISTINCT Test.id, type, lastQuestion, numQuestions, validAnswers, languageAnswerId, languageQuestionId FROM Test JOIN Question ON Question.testId=Test.id WHERE Test.memberId=? AND lastQuestion!=numQuestions AND Question.archivedAt IS NULL;';
        const params = [id];

        Member.app.datasources.langua.connector.execute(sql, params, function (err, results) {
            if (err) {
                console.log(err);
                cb(err, []);
                return;
            }

            cb(null, results);
        });

    }

    Member.remoteMethod('unfinishedTests', {
        accepts: [
            {arg: 'id', type: 'number', required: true}
        ],
        http: {path: '/:id/unfinishedTests', verb: 'get'},
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
    }

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
    }

    Member.remoteMethod('resetResults', {
        accepts: [
            {arg: 'id', type: 'number', required: true},
            {arg: 'type', type: 'string'}
        ],
        http: {path: '/:id/resetResults', verb: 'get'},
        returns: {type: 'boolean', root: true}
    });
};

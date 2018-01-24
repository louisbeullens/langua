'use strict';

var async = require('async');

module.exports = function (Language) {

    Language.getWordTypes = function (id, cb) {

        // (LEFT) JOIN wel nodig?
        var sql = "SELECT DISTINCT WordType.id, WordType.name FROM Word JOIN WordType ON wordTypeId=WordType.id WHERE languageId=? AND wordTypeId != 0 ORDER BY WordType.id;";

        Language.app.dataSources.langua.connector.execute(sql, [id], function (err, results) {
            if (err) {
                console.log(err);
                cb(err, []);
            }

            var wordTypes = [];

            for (var i = 0; i < results.length; i++) {
                wordTypes.push({ id: results[i].id, name: results[i].name });
            }

            cb(null, wordTypes);
        })
    }

    Language.remoteMethod('getWordTypes', {
        http: { path: '/:id/wordTypes', verb: 'get' },
        accepts: { arg: 'id', type: 'number' },
        returns: { type: '[WordType]', root: true }
    });

    Language.getTenses = function (id, cb) {

        var sql = "SELECT DISTINCT Tense.id, Tense.name, Tense.order FROM Conjugation JOIN Tense ON tenseId=Tense.id WHERE languageId=? ORDER BY Tense.order ASC;";

        Language.app.dataSources.langua.connector.execute(sql, [id], function (err, results) {
            if (err) {
                console.log(err);
                cb(err, []);
            }

            var Tenses = [];

            for (var i = 0; i < results.length; i++) {
                Tenses.push({ id: results[i].id, name: results[i].name });
            }

            cb(null, Tenses);
        })
    }

    Language.remoteMethod('getTenses', {
        http: { path: '/:id/tenses', verb: 'get' },
        accepts: { arg: 'id', type: 'number' },
        returns: { type: '[Tense]', root: true }
    });

    Language.info = function(cb) {
        function getWordCount(languageId, cb) {
            Language.app.models.Word.count({
                and: [
                    { languageId: languageId },
                    { wordTypeId: { neq: 19 } }
                ]
            }, function(err, count) {
                cb(err, count);
            });
        }

        function getVerbCount(languageId, cb) {
            Language.app.models.Word.count({
                and: [
                    { languageId: languageId },
                    { wordTypeId: 19 }
                ]
            }, function(err, count) {
                cb(err, count);
            });
        }

        function getConjugationCount(languageId, cb) {
            Language.app.models.Tense.find({
                where: {
                    languageId: languageId
                }
            }, function (err, tenses) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    const tenseIds = tenses.map(function (tense) {
                        return tense.id;
                    });
                    Language.app.models.Conjugation.count({
                        tenseId: { inq: tenseIds }
                    }, function(err, count) {
                        cb(err, count);
                    });
                }
            });
        }

        console.log('info');

        const info = {};
        async.waterfall([
            function (cb) {
                async.series([
                    async.apply(getWordCount, 1),
                    async.apply(getVerbCount, 1),
                    async.apply(getConjugationCount, 1)
                ], function (err, results) {
                    cb(err, { wordCount: results[0], verbCount: results[1], conjugaionCount: results[2] });
                });
            },
            function (spanish, cb) {
                info[1] = spanish;
                async.series([
                    async.apply(getWordCount, 2),
                    async.apply(getVerbCount, 2),
                    async.apply(getConjugationCount, 2)
                ], function (err, results) {
                    cb(err, { wordCount: results[0], verbCount: results[1], conjugaionCount: results[2] });
                });
            },
            function (english, cb) {
                info[2] = english;
                async.series([
                    async.apply(getWordCount, 5),
                    async.apply(getVerbCount, 5),
                    async.apply(getConjugationCount, 5)
                ], function (err, results) {
                    cb(err, { wordCount: results[0], verbCount: results[1], conjugaionCount: results[2] });
                });
            }
        ], function (err, french) {
                info[5] = french;
                cb(err, info);
            })
    }

    Language.remoteMethod('info', {
        http: {path: '/info', verb: 'get'},
        returns: {type: 'object', root: true}
    })
};

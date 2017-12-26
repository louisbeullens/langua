'use strict';

const async = require('async');
const privateSettings = require('../private-settings');
const DataSource = require('loopback-datasource-juggler').DataSource;

module.exports = function (app, next) {

    app.datasources.sendgrid = new DataSource({
        connector: require("loopback-sendgrid-connector"),
        api_key: privateSettings.sendgridApiKey,
        from: "noreply@langua.be"
    });

    const start = Date.now();

    const langua = app.datasources.langua;
    const langua_be = app.datasources.langua_be;

    const VERBOSE = true;

    function DEBUG() {
        if (VERBOSE) {
            console.log(...arguments);
        }
    }

    const operations = {
        '--empty': 0,
        '--reset': 1,
        '--update': 2,
        '--populate': 3
    }

    const models = {
        test: [newModel, 'Test'],
        question: [newModel, 'Question'],
        answer: [newModel, 'Answer'],
        member: [importModel, 'Member', 'users', {where: {userfirstname: {neq: '?'}}, order: 'userid ASC'}, bulkCreate, memberMapFn],
        iplocation: [newModel, 'IpLocation'],
        language: [importModel, 'Language', 'langs', {order: 'langid ASC'}, syncCreate, LanguageMapFn],
        tense: [importModel, 'Tense', 'tenses', {order: 'tensid ASC'}, syncCreate, TenseMapFn],
        wordtype: [importModel, 'WordType', 'wordtypes', {where: {wordtypeid: {neq: 0}}, order: 'wordtypeid ASC'}, wordTypeCreate, wordTypeMapFn],
        word: [importModel, 'Word', 'words', {where: {wwordtypeid: {neq: 0}}, order: 'wid ASC'}, bulkCreate, wordMapFn],
        verb: [importModel, 'Word', 'verbs', {order: 'verbid ASC'}, bulkCreate, verbMapFn],
        wordtranslation: [importModel, 'Translation', 'transwords', {order: 'twid ASC'}, relatedToWordCreate, wordTranslationMapFn],
        verbtranslation: [importModel, 'Translation', 'transverbs', {order: 'tvid ASC'}, relatedToWordCreate, verbTranslationMapFn],
        conjugation: [importModel, 'Conjugation', 'conjugations', {order: 'conjid ASC'}, relatedToWordCreate, conjugationMapFn],
        conjugationform: [importModel, 'ConjugationForm', 'pvs', {order: 'pvid ASC'}, bulkCreate, conjugationFormMapFn],
        book: [importModel, 'Book', 'books', {order: 'bookid ASC'}, bulkCreate, bookMapFn]
    }

    var operation = -1;
    const tasks = [];
    const resetModels = [];

    if (process.argv.length > 2) {
        const args = process.argv;

        for (var i = 0; i < args.length; i++) {
            const arg = args[i];
            if (operations[arg] !== undefined) {
                operation = operations[arg];
                if (i+1 === args.length) {
                    for (var key in models) {
                        addEntry(key);
                    }
                }
            } else if (operation > -1 && models[arg] !== undefined) {
                addEntry(arg);
            }
        }

        if (tasks.length > 0) {

            const method = (resetModels.length > 0) ? langua.automigrate : function(models, callback) { process.nextTick(callback) };

            method.call(langua,resetModels, function(err) {
                if (resetModels.length === 1) {
                    DEBUG('created table', resetModels[0]);
                } else if (resetModels.length > 1) {
                    DEBUG('created tables', resetModels.join(', '));
                }
                async.series(tasks, function(err) {
                    DEBUG('finished, took',Math.round((Date.now() - start) / 1000),'seconds')
                    next();
                });
            });
        } else {
            next();
        }
    } else {
        next();
    }

    function addEntry(key) {
        if ((operation & 2) == 0 && resetModels.indexOf(models[key][1]) === -1) {
            resetModels.push(models[key][1]);
        }
        tasks.push(async.apply(...models[key], operation));
    }

    function newModel(modelName, operation, cb) {
        langua.autoupdate(modelName, function (err) {
            if (operation & 2) {
                DEBUG('updated table', modelName);
            }
            cb();
        });
    }

    function importModel(modelName, tableName, filter, createFn, mapFn, operation, cb) {

        const method = (operation & 2) ? langua.autoupdate : function(modelName, callback) { process.nextTick(callback) };

        method.call(langua, modelName, function (err) {

            if (err) {
                return cb();
            }

            if (operation & 2) {
                DEBUG('updated table', modelName);
            }

            if ((operation & 1)) {
                langua_be.discoverAndBuildModels(tableName, {}, function (err, models) {
                    if (err) {
                        return cb();
                    }

                    models[tableName[0].toUpperCase() + tableName.slice(1).toLowerCase()].find(filter, function (err, results) {
                        if (err) {
                            return cb();
                        }

                        if (results.length > 0) {
                            createFn(modelName, results, mapFn, cb);
                        } else {
                            return cb();
                        }
                    });
                });
            } else {
                cb();
            }
        });
    }

    function bulkCreate(modelName, results, mapFn, cb) {
        app.models[modelName].create(results.map(mapFn), function (err) {
            DEBUG('bulkCreate inserted', modelName);
            if (err) {
                for (var i=0; i<err.length; i++) {
                    if (err[i]) {
                        DEBUG(err[i].message);
                    }
                }
            }
            return cb();
        });
    }

    function syncCreate(modelName, results, mapFn, cb) {
        function create(entry, cb) {
            function createCallback(err) {
                if (err)
                    DEBUG(err.message);
                return cb();
            }

            app.models[modelName].create(entry, createCallback);
        }

        const transformedResults = results.map(mapFn);
        const tasks = [];

        for (var i = 0; i < transformedResults.length; i++) {
            tasks.push(async.apply(create, transformedResults[i]))
        }
        async.series(tasks, function (err) {
            DEBUG('syncCreate inserted', modelName);
            cb();
        });
    }

    function wordTypeCreate(modelName, results, mapFn, cb) {
        function createCallback(err) {
            app.models.WordType.create({name: 'WW'}, function (err) {
                DEBUG('wordTypeCreate inserted');
                cb();
            })
        }

        syncCreate(modelName, results, mapFn, createCallback);
    }

    function relatedToWordCreate(modelName, results, mapFn, cb) {
        app.models.Word.find({fields: {_old_id: true, wordTypeId: true}, order: 'id ASC'}, function (err, words) {
            if (err) {
                return cb();
            }

            const relatedToWords = [];

            for (var i = 0; i < results.length; i++) {
                const relatedToWord = mapFn(results[i], words);
                if (relatedToWord) {
                    relatedToWords.push(relatedToWord);
                }
            }

            app.models[modelName].create(relatedToWords, function (err) {
                DEBUG('relatedToWordCreate inserted', modelName);
                cb();
            });
        });
    }

    function memberMapFn(a) {
        return {
            firstname: a.userfirstname,
            lastname: a.userlastname,
            email: a.useremail.trim(),
            username: a.userloginname,
            password: a.userpassword,
            _old_id: a.userid,
            emailVerified: true
        };
    }

    function LanguageMapFn(a) {
        return {
            name: a.langname,
            _old_id: a.langid
        };
    }

    function wordTypeMapFn(a) {
        return {name: a.wordtypename};
    }

    function wordMapFn(a) {
        return {
            gender: a.wsex,
            articleSingular: a.wblev,
            singular: a.wev,
            articlePlural: a.wblmv,
            plural: a.wmv,
            hint: a.wtip,
            _old_id: a.wid,
            languageId: a.wlangid,
            wordTypeId: a.wwordtypeid
        };
    }

    function verbMapFn(a) {
        return {
            singular: a.verbname,
            hint: a.verbtip,
            _old_id: a.verbid,
            languageId: a.verblangid,
            wordTypeId: 19
        };
    }

    function bookMapFn(a) {
        return {
            name: a.bookname,
            languageId: a.booklangid,
            _old_id: a.bookid
        };
    }

    function TenseMapFn(a) {
        return {
            name: a.tensname,
            order: a.tensorder,
            languageId: a.tenslangid
        };
    }

    function conjugationFormMapFn(a) {
        return {
            form: a.pvpersid,
            name: a.pvname,
            languageId: a.pvlangid
        };
    }

    function wordTranslationMapFn(a, ids) {
        function findId(id) {
            return function (item) {
                return (item._old_id == id && item.wordTypeId !== 19);
            }
        }

        const translation = {
            word1Id: ids.findIndex(findId(a.twwordid1)) + 1,
            word2Id: ids.findIndex(findId(a.twwordid2)) + 1
        };

        if (translation.word1Id > 0 && translation.word2Id > 0) {
            return translation;
        } else {
            return null;
        }
    }

    function verbTranslationMapFn(a, ids) {
        function findId(id) {
            return function (item) {
                return (item._old_id == id && item.wordTypeId === 19);
            }
        }

        const translation = {
            word1Id: ids.findIndex(findId(a.tvverbid1)) + 1,
            word2Id: ids.findIndex(findId(a.tvverbid2)) + 1
        };

        if (translation.word1Id > 0 && translation.word2Id > 0) {
            return translation;
        } else {
            return null;
        }
    }

    function conjugationMapFn(a, ids) {
        function findId(id) {
            return function (item) {
                return (item._old_id == id && item.wordTypeId === 19);
            }
        }

        const conjugation = {
            isRegular: a.conjreg,
            form1: a.conj1,
            form1Regular: (a.conji1) ? false : true,
            form2: a.conj2,
            form2Regular: (a.conji2) ? false : true,
            form3: a.conj3,
            form3Regular: (a.conji3) ? false : true,
            form4: a.conj4,
            form4Regular: (a.conji4) ? false : true,
            form5: a.conj5,
            form5Regular: (a.conji5) ? false : true,
            form6: a.conj6,
            form6Regular: (a.conji6) ? false : true,
            verbId: ids.findIndex(findId(a.conjverbid)) + 1,
            tenseId: a.conjtensid
        };

        if (conjugation.verbId > 0) {
            return conjugation;
        } else {
            return null;
        }
    }
};
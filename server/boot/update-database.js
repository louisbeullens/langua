'use strict';

const async = require('async');

module.exports = function (app) {
    var langua_be = app.dataSources.langua_be;
    var langua = app.dataSources.langua;

    if (process.argv.length > 2 && process.argv[2] == '--reset') {
        console.log('reseting');
        async.series([
            //async.apply(createLanguages),
            //async.apply(importMembers),
            async.apply(importWordTypes),
            async.apply(importTenses),
            async.apply(importWords),
            async.apply(follow),
            async.apply(importConjugations)
        ]);
    }

    function follow(cb) {
        langua.automigrate(['Translation']);
        cb(null,null);
    };

    function importConjugations(cb) {
        console.log('--> import conjugations')
        langua.automigrate(['Conjugation'], function (err) {
            if (err)
                throw(err);

            langua_be.discoverAndBuildModels('conjugations', {}, function (err, model) {
                if (err)
                    throw(err);

                model.Conjugations.find({}, function (err, conjugations) {

                    for (var i = 0; i < conjugations.length; i++) {
                        importConjugation(conjugations[i]);
                    }

                    console.log('<-- import conjugations')

                    cb(err, null);

                });
            });
        });
    };

    function importConjugation(conjugation) {
        app.models.Word.findOne({
            where: {
                and: [
                    {_old_id: conjugation.conjverbid},
                    {wordTypeId: 19}]
            }
        }, function (err, word) {
            if (err)
                console.log(err);

            if (word) {
                const newConj = {
                    verbId: word.id,
                    tenseId: conjugation.conjtensid,
                    isRegular: conjugation.conjreg,
                    form1: conjugation.conj1,
                    form1Regular: (conjugation.conji1 == 1) ? false : true,
                    form2: conjugation.conj2,
                    form2Regular: (conjugation.conji2 == 1) ? false : true,
                    form3: conjugation.conj3,
                    form3Regular: (conjugation.conji3 == 1) ? false : true,
                    form4: conjugation.conj4,
                    form4Regular: (conjugation.conji4 == 1) ? false : true,
                    form5: conjugation.conj5,
                    form5Regular: (conjugation.conji5 == 1) ? false : true,
                    form6: conjugation.conj6,
                    form6Regular: (conjugation.conji6 == 1) ? false : true,
                };
                app.models.Conjugation.create(newConj, createCallback);
            }
            else
                console.log('Werkwoord met _old_id ' + conjugation.conjverbid + ' niet gevonden');
        });
    }

    //
    // I M P O R T   W O R D T Y P E S
    //

    function importWordTypes(cb) {
        langua.automigrate(['WordType'], function (err) {
            if (err)
                throw(err);

            console.log('--> importWordTypes');

            langua_be.discoverAndBuildModels('wordtypes', {}, function (err, model) {
                if (err)
                    throw(err);

                model.Wordtypes.find({order: ['wordtypeID ASC']}, function (err, wordtypes) {
                    console.log(wordtypes.length);
                    console.log(wordtypes[0]);

                    var tasks = [];

                    for (var i = 1; i < wordtypes.length; i++) {
                        tasks.push(async.apply(createWordType, wordtypes[i].wordtypename));
                    }

                    tasks.push(async.apply(createWordType, 'WW'));

                    async.series(tasks, function (err) {
                        if (err)
                            console.log(err);
                        console.log('<-- importWordTypes');
                        cb(err, null);
                    });
                });
            });
        });
    }

    function createWordType(name, cb) {
        app.models.WordType.create({name: name}, function (err) {
            if (err)
                console.log(err);
            else
                console.log(name);
            cb(err, null);
        });
    }

    //
    // I M P O R T   T E N S E S
    //

    function importTenses(cb) {
        langua.automigrate(['Tense'], function (err) {
            if (err)
                throw(err);

            console.log('--> importTenses');

            langua_be.discoverAndBuildModels('tenses', {}, function (err, model) {
                if (err)
                    throw(err);

                model.Tenses.find({order: ['tensID ASC']}, function (err, tenses) {
                    console.log(tenses.length);
                    console.log(tenses[0]);

                    var tasks = [];

                    for (var i = 0; i < tenses.length; i++) {
                        tasks.push(async.apply(createTense, tenses[i].tensname, tenses[i].tensorder, tenses[i].tenslangid));
                    }

                    async.series(tasks, function (err) {
                        if (err)
                            console.log(err);

                        console.log('<-- importTenses')

                        cb(err, null);
                    });
                });
            });
        });
    }

    function createTense(name, order, languageId, cb) {
        app.models.Tense.create({name: name, order: order, languageId: languageId}, function (err) {
            if (err)
                console.log(err);
            else
                console.log(name);
            cb(err, null);
        });
    }

    //
    // I M P O R T   W O R D S
    //

    function importWords(cb) {
        langua.automigrate(['Word'], function (err) {
            if (err)
                throw(err);

            console.log("--> importWords");

            langua_be.discoverAndBuildModels('words', {}, function (err, model) {
                if (err)
                    throw(err);

                model.Words.find({}, function (err, words) {
                    if (err)
                        throw(err);

                    for (var i = 0; i < words.length; i++) {

                        createWord(words[i]);
                    }

                    langua_be.discoverAndBuildModels('verbs', {}, function (err, model) {
                        if (err)
                            throw(err);

                        model.Verbs.find({}, function (err, verbs) {
                            if (err)
                                console.log(err);

                            for (var i = 0; i < verbs.length; i++) {
                                createVerb(verbs[i]);
                            }
                        });
                    });

                    console.log('<-- importWords')

                    cb(err, null); //einde import gebeurt ver voordat woorden in database zitten ASYNCROON
                });

            });

        });
    }

    function createWord(word) {
        app.models.Word.create({
            languageId: word.wlangid,
            gender: word.wsex,
            articleSingular: word.wblev,
            singular: word.wev,
            articlePlural: word.wblmv,
            plural: word.wmv,
            hint: word.wtip,
            wordTypeId: word.wwordtypeid,
            _old_id: word.wid
        }, createCallback);
    }

    function createVerb(verb) {
        app.models.Word.create({
            languageId: verb.verblangid,
            gender: '',
            articleSingular: '',
            singular: verb.verbname,
            articlePlural: '',
            plural: '',
            index: verb.verbindex,
            hint: verb.verbtip,
            wordTypeId: 19,
            _old_id: verb.verbid
        }, createCallback);
    }

    //
    // I M P O R T   W O R D S W O R D S
    //

    function importWordsWords(cb) {
        langua.automigrate(['WordsWords'], function (err) {
            if (err)
                throw(err);

            console.log('--> importWordsWords')

            langua_be.discoverAndBuildModels('transwords', {}, function (err, model) {
                if (err)
                    throw(err);

                model.Transwords.find({}, function (err, transwords) {
                    if (err)
                        throw(err);

                    for (var i = 0; i < transwords.length; i++) {
                        importTransword(transwords[i]);
                    }

                    console.log('<-- importWordsWords');

                    cb(err,null);
                })
            });
        });
    }

    function importTransword(transword) {
        //console.log('importTransWord');
        app.models.Word.find({
            where: {
                and: [
                    { or: [
                            {_old_id: transword.twwordid1},
                            {_old_id: transword.twwordid2},
                        ]
                    },
                    {wordTypeId: {neq: 19}}
                ]
            }
        }, function (err, words) {

            var word1 = words.find(function(word) {
                return word._old_id === transword.twwordid1;
            });

            if (!word1) {
                console.log('_old_id: ' + transword.twwordid1 + ' voor twwordid1 niet gevonden');
                return;
            }

            var word2 = words.find(function(word) {
                return word._old_id === transword.twwordid2;
            });

            if (!word2) {
                console.log('_old_id: ' + transword.twwordid2 + ' voor twwordid2 niet gevonden');
                return;
            }

            app.models.WordsWords.create({word1Id:word1.id, word2Id:word2.id});
        });
    }

    //
    // C R E A T E   L A N G U A G E S
    //

    function createLanguages(cb) {
        langua.automigrate(['Language'], function (err) {
            if (err)
                throw(err);

            async.series([
                async.apply(createLanguage, 1, 'Spaans'),
                async.apply(createLanguage, 2, 'Engels'),
                async.apply(createLanguage, 3, 'Latijn'),
                async.apply(createLanguage, 4, 'Nederlands'),
                async.apply(createLanguage, 5, 'Frans')
            ], function (err, results) {
                if (err)
                    console.log(err);
                else
                    console.log(results);
                cb(err, null);
            });
        });
    }

    function createLanguage(oldId, name, callback) {
        app.models.Language.create({_old_id: oldId, name: name}, function (err) {
            if (err)
                console.log(err);
            else
                console.log(name);
            callback(err, name);
        });
    }

    //
    // I M P O R T   M E M B E R S
    //

    function importMembers(cb) {
        langua.automigrate(['Member'], function (err) {
            if (err)
                throw(err);

            console.log("start automigrate");

            langua_be.discoverAndBuildModels('users', {}, function (err, model) {
                if (err)
                    throw(err);

                model.Users.find({where: {userfirstname: {neq: '?'}}, limit: 10}, function (err, users) {
                    if (err)
                        throw(err);

                    console.log("start find");

                    console.log("aantal gebruikers: " + users.length);
                    for (var i = 0; i < users.length; i++) {
                        console.log("create", i);

                        createMember(users[i]);

                        console.log("after create");
                    }

                    cb(err, null);
                    console.log("einde find");
                });
                console.log("after find");
            });
            console.log("einde automigrate");
        });
        console.log("after automigrate");
    }

    function createMember(user) {
        console.log("begin createMember");

        app.models.Member.create({
            firstname: user.userfirstname,
            lastname: user.userlastname,
            email: user.useremail,
            username: user.userloginname,
            password: user.userpassword
        }, createCallback);

        console.log("einde createMember");
    }

    function createCallback(err, result) {

        if (err)
            console.log(err);
        else
            ;//console.log(result);
    }
};

'use strict';

module.exports = function (Test) {

    var limit = 20;

    function createTestTranslations(ctx, next) {
        const selection = "word1Id," +
            " word1.languageId AS languageId1," +
            " word2Id," +
            " word2.languageId AS languageId2," +
            " word1.singular AS singular1," +
            " word1.plural AS plural1," +
            " word2.singular AS singular2," +
            " word2.plural AS plural2," +
            " word1.*," +
            " word2.*";

        var query = "SELECT " + selection +
            "FROM Translation " +
            "JOIN Word AS word1 ON word1Id=word1.id " +
            "JOIN Word AS word2 ON word2Id=word2.id " +
            "WHERE ((word1.languageId=? AND word2.languageId=?) OR (word1.languageId=? AND word2.languageId=?)) AND word1.wordTypeId in (?) AND word1.wordTypeId = word2.wordTypeId;";

        //nooit eerder gemaakte vragen

        if (ctx.args.data.selection === 1) {
            var subquery = "SELECT Word.id FROM Word LEFT JOIN Question ON Word.id=Question.linkId LEFT JOIN Answer ON Question.id=Answer.QuestionId WHERE languageId=? AND Answer.id IS NOT NULL AND Question.memberId=? AND Question.archivedAt IS NULL";

            var query = "SELECT " + selection +
                " FROM Translation" +
                " JOIN Word AS word1 ON word1Id=word1.id" +
                " JOIN Word AS word2 ON word2Id=word2.id" +
                " WHERE ((word1.languageId=? AND word2.languageId=?)" +
                " OR (word1.languageId=? AND word2.languageId=?))" +
                " AND word1.wordTypeId in (?)" +
                " AND word1.wordTypeId = word2.wordTypeId" +
                " AND (word1Id NOT IN (" + subquery + ") AND word2Id NOT IN (" + subquery + "))";
        }

        // ooit eerder gemaakte fouten

        if (ctx.args.data.selection === 2) {
            var subquery = "SELECT Word.id FROM Word JOIN Question ON Word.id=Question.linkId JOIN Answer ON Question.id=Answer.QuestionId WHERE languageId=? AND Answer.valid=false AND Question.memberId=? AND Question.archivedAt IS NULL";

            var query = "SELECT " + selection +
                " FROM Translation" +
                " JOIN Word AS word1 ON word1Id=word1.id" +
                " JOIN Word AS word2 ON word2Id=word2.id" +
                " WHERE ((word1.languageId=? AND word2.languageId=?)" +
                " OR (word1.languageId=? AND word2.languageId=?))" +
                " AND word1.wordTypeId in (?)" +
                " AND word1.wordTypeId = word2.wordTypeId" +
                " AND (word1Id IN (" + subquery + ") OR word2Id IN (" + subquery + "))";
        }

        //nooit gooed gemaakte vragen

        if (ctx.args.data.selection === 3) {
            var subquery = "SELECT Word.id FROM Word JOIN Question ON Word.id=Question.linkId JOIN Answer ON Question.id=Answer.QuestionId WHERE languageId=? AND Answer.valid=true AND Question.memberId=? AND Question.archivedAt IS NULL";

            var query = "SELECT " + selection +
                " FROM Translation" +
                " JOIN Word AS word1 ON word1Id=word1.id" +
                " JOIN Word AS word2 ON word2Id=word2.id" +
                " WHERE ((word1.languageId=? AND word2.languageId=?)" +
                " OR (word1.languageId=? AND word2.languageId=?))" +
                " AND word1.wordTypeId in (?)" +
                " AND word1.wordTypeId = word2.wordTypeId" +
                " AND (word1Id NOT IN (" + subquery + ") AND word2Id NOT IN (" + subquery + "))";
        }

        var params = [
            ctx.args.data.languageAnswerId,
            ctx.args.data.languageQuestionId,
            ctx.args.data.languageQuestionId,
            ctx.args.data.languageAnswerId,
            ctx.args.data.wordTypeIds,
            ctx.args.data.languageAnswerId,
            ctx.args.data.memberId,
            ctx.args.data.languageAnswerId,
            ctx.args.data.memberId
        ];

        Test.app.dataSources.langua.connector.execute(query, params, function (err, results) {
            if (err) {
                return next(err);
            }

            var ids = [];

            function findId(id) {
                return function (item) {
                    return item.id === id;
                }
            }

            while (results.length > 0 && ids.length < limit) {
                const i = Math.floor(Math.random() * results.length);
                var singularPossible = false;
                var pluralPossible = false;

                var id = 0;

                if (results[i].languageId1 === ctx.args.data.languageAnswerId && ids.findIndex(findId(results[i].word1Id)) === -1) {

                    if (results[i]['singular1'] !== '' && results[i]['singular2'] !== '') {
                        singularPossible = true;
                    }
                    if (results[i]['plural1'] !== '' && results[i]['plural2'] !== '') {
                        pluralPossible = true;
                    }
                    id = results[i].word1Id;
                }
                else if (results[i].languageId2 === ctx.args.data.languageAnswerId && ids.findIndex(findId(results[i].word2Id)) === -1) {

                    if (results[i]['singular1'] !== '' && results[i]['singular2'] !== '') {
                        singularPossible = true;
                    }
                    if (results[i]['plural1'] !== '' && results[i]['plural2'] !== '') {
                        pluralPossible = true;
                    }
                    id = results[i].word2Id;
                }


                if (id) {
                    var singular = (Math.random() < 0.5) ? true : false;
                    if (singularPossible && pluralPossible)
                        ;
                    else if (singularPossible)
                        singular = true;
                    else if (pluralPossible)
                        singular = false;
                    else
                        id = 0;

                    if (id) {
                        ids.push({id: id, form: singular ? 'S' : 'P'});
                    }
                }

                results.splice(i,1);
            }

            if (ids.length === 0) {
                next(new Error("Geen vragen gevonden"));
            }

            ctx.args.data['lastQuestion'] = 0;
            ctx.args.data['numQuestions'] = ids.length;

            ctx.session = {ids: ids};

            next();
        });
    }

    function createTestConjugations(ctx, next) {

        var regulartityCondition = '';

        if (ctx.args.data.regularity === 1) {
            regulartityCondition = 'isRegular=1 AND ';
        } else if (ctx.args.data.regularity === 2) {
            regulartityCondition = 'isRegular=0 AND ';
        }

        const sql = "SELECT * FROM Conjugation WHERE " + regulartityCondition + "tenseId IN (?);";

        const params = [ctx.args.data.tenseIds];

        const ids = [];

        Test.app.datasources.langua.connector.execute(sql, params, function (err, results) {

            if (err) {
                next(err);
            }

            function findId(id) {
                return function (item) {
                    return item.id === id;
                }
            }

            while (results.length > 0 && ids.length < limit) {
                const i = Math.floor(Math.random() * results.length);

                const forms = [];
                const verb = results[i];

                if (ids.findIndex(findId(verb.id)) === -1) {

                    for (var j = 1; j <= 6; j++) {
                        if (verb["form" + j.toString()] !== '') {
                            forms.push(j.toString());
                        }
                    }

                    if (forms.length > 0) {
                        ids.push({id: verb.id, form: forms[Math.floor(Math.random() * forms.length)]});
                    }

                }

                results.splice(i,1);
            }

            if (ids.length === 0) {
                next(new Error("Geen vragen gevonden"));
            }

            ctx.args.data['lastQuestion'] = 0;
            ctx.args.data['numQuestions'] = ids.length;

            ctx.session = {ids: ids};
            next();
        });

    }

    Test.beforeRemote('create', function (ctx, testObject, next) {

        if (ctx.args.data.type === 'T') {
            createTestTranslations(ctx, next);
        } else if (ctx.args.data.type === 'C') {
            createTestConjugations(ctx, next);
        } else {
            next(new Error("Type onbekend"));
        }
    });

    Test.afterRemote('create', function (ctx, testInstance, next) {

        var ids = ctx.session.ids;

        for (var i = 0; i < ids.length; i++) {
            var question = {
                linkId: ids[i].id,
                form: ids[i].form,
                order: (i + 1),
                memberId: ctx.args.data.memberId
            }
            testInstance.__create__questions(question, function (err, result) {
                if (err)
                    console.log(err);
            });
        }

        next();
    });

    Test.getQuestion = function (testId, questionPosition, cb) {

        Test.app.models.Question.findOne({
            include: [
                'test',
                {
                    relation: 'conjugation',
                    scope: {
                        include: ['verb', 'tense']
                    }
                }, {
                    relation: 'word',
                    scope: {
                        include: ['translations1', 'translations2']
                    }
                }
            ], where: {
                testId: testId,
                order: questionPosition
            }
        }, function (err, question) {
            if (err) {
                cb(err);
            }

            if (question) {
                const test = question.test();
                if (test.type === 'T') {
                    const word = question.word();
                    question.unsetAttribute('conjugation');
                    word.translations = word.translations1().concat(word.translations2());
                    word.unsetAttribute('translations1');
                    word.unsetAttribute('translations2');
                    return cb(null, question);
                } else if (test.type === 'C') {
                    const conjugation = question.conjugation();
                    question.unsetAttribute('word');
                    const filter = {
                        where: {
                            and: [
                                {languageId: test.languageQuestionId},
                                {form: parseInt(question.form)}
                            ]
                        }
                    };
                    Test.app.models.ConjugationForm.find(filter, function (err, conjugationForms) {
                        if (err) {
                            return cb(err, null);
                        }

                        if (conjugationForms.length > 0) {
                            question.prefix = conjugationForms[Math.floor(Math.random() * conjugationForms.length)].name;
                        }
                        else {
                            question.prefix = '';
                        }

                        return cb(null, question);
                    });
                } else {
                    return cb(new Error("Geen vraag gevonden"), null);
                }
            } else {
                return cb(new Error("onbekend test type"), null);
            }
        });
    }

    Test.remoteMethod('getQuestion', {
        http: {path: '/:id/question/:position', verb: 'get'},
        accepts: [
            {arg: 'id', type: 'number'},
            {arg: 'position', type: 'number'}
        ],
        returns: {type: 'Question', root: true}
    });
};

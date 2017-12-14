'use strict';

module.exports = function (Test) {


    Test.beforeRemote('create', function (ctx, testObject, next) {

        console.log('beforeCreate');

        console.log(ctx.args.data);

        const limit = 20;

        if (true) {
            var query = "SELECT word1Id," +
                " word1.languageId AS languageId1," +
                " word2Id," +
                " word2.languageId AS languageId2," +
                " word1.singular AS singular1," +
                " word1.plural AS plural1," +
                " word2.singular AS singular2," +
                " word2.plural AS plural2," +
                " word1.*," +
                " word2.*" +
                "FROM Translation " +
                "JOIN Word AS word1 ON word1Id=word1.id " +
                "JOIN Word AS word2 ON word2Id=word2.id " +
                // "JOIN WordType AS WT1 ON word1.wordTypeId=WT1.id " +
                // "JOIN WordType AS WT2 ON word2.wordTypeId=WT2.id " +
                // "WHERE ((word1.languageId=? AND word2.languageId=?) OR (word1.languageId=? AND word2.languageId=?)) AND WT1.name in (?) AND WT1.id = WT2.id;";
                "WHERE ((word1.languageId=? AND word2.languageId=?) OR (word1.languageId=? AND word2.languageId=?)) AND word1.wordTypeId in (?) AND word1.wordTypeId = word2.wordTypeId;";

            if (ctx.args.data.selection === 1) {
                var subquery = "SELECT Word.id FROM Word LEFT JOIN Question ON Word.id=Question.wordId LEFT JOIN Answer ON Question.id=Answer.QuestionId WHERE languageId=? AND Answer.id IS NOT NULL AND Question.memberId=?";

                var query = "SELECT word1Id," +
                    " word1.languageId AS languageId1," +
                    " word2Id," +
                    " word2.languageId AS languageId2," +
                    " word1.singular AS singular1," +
                    " word1.plural AS plural1," +
                    " word2.singular AS singular2," +
                    " word2.plural AS plural2," +
                    " word1.*," +
                    " word2.*" +
                    " FROM Translation" +
                    " JOIN Word AS word1 ON word1Id=word1.id" +
                    " JOIN Word AS word2 ON word2Id=word2.id" +
                    // "JOIN WordType AS WT1 ON word1.wordTypeId=WT1.id " +
                    // "JOIN WordType AS WT2 ON word2.wordTypeId=WT2.id " +
                    // "WHERE ((word1.languageId=? AND word2.languageId=?) OR (word1.languageId=? AND word2.languageId=?)) AND WT1.name in (?) AND WT1.id = WT2.id;";
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

            var start = +new Date();

            Test.app.dataSources.langua.connector.execute(query, params, function (err, results) {
                var stop = +new Date();
                console.log('query time sql: ' + (stop - start).toString());
                if (err) {
                    console.log(err);
                    return;
                }

                var ids = [];

                console.log(results.length);
                console.log(results[17]);

                start = +new Date();

                function findId(id) {
                    return function(item) {
                        return item.id === id;
                    }
                }

                for (var i = 0; i < results.length && ids.length < limit; i++) {
                    var singularPossible = false;
                    var pluralPossible = false;

                    var id = 0;

                    if (results[i].languageId1 === ctx.args.data.languageAnswerId && ids.findIndex(findId(results[i].word1Id)) === -1) {

                        //console.log("1 --> 2");

                        if (results[i]['singular1'] !== '' && results[i]['singular2'] !== '') {
                            singularPossible = true;
                        }
                        if (results[i]['plural1'] !== '' && results[i]['plural2'] !== '') {
                            pluralPossible = true;
                        }
                        id = results[i].word1Id;
                    }
                    else if (results[i].languageId2 === ctx.args.data.languageAnswerId && ids.findIndex(findId(results[i].word2Id)) === -1) {

                        //console.log("2 --> 1");

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
                            ids.push({id: id, singular: singular});
                        }
                    }
                }

                var stop = +new Date();
                console.log('filter time papa: ' + (stop - start).toString());

                ctx.args.data['lastQuestion'] = 0;
                ctx.args.data['numQuestions'] = ids.length;

                ctx.session = {ids: ids};

                console.log('ids.length', ids.length);

                for (var key in testObject)
                    console.log(key);

                next();
            });
        }

        else {

            var selection = ctx.args.data.selection;

            console.log('selection ', selection);

            var scope = {
                where: {
                    languageId: ctx.args.data.languageQuestionId
                }
            };

            var filter = {
                fields: {id: true, wordTypeId: true},
                include: [
                    {
                        relation: 'translations1',
                        scope: scope
                    },
                    {
                        relation: 'translations2',
                        scope: scope
                    }
                ],
                where: {
                    and: [
                        {languageId: ctx.args.data.languageAnswerId},
                        {wordTypeId: {inq: ctx.args.data.wordTypeIds}}
                    ]
                }
            };

            if (ctx.args.data.selection === 1) {
                filter = {
                    fields: {id: true, wordTypeId: true},
                    include: [
                        {
                            relation: 'translations1',
                            scope: scope
                        },
                        {
                            relation: 'translations2',
                            scope: scope
                        },
                        {
                            relation: 'questions',
                            scope: {
                                include: 'answers',
                                where: {
                                    memberId: ctx.args.data.memberId
                                }
                            }
                        }
                    ],
                    where: {
                        and: [
                            {languageId: ctx.args.data.languageAnswerId},
                            {wordTypeId: {inq: ctx.args.data.wordTypeIds}}
                        ]
                    }
                };
            }

            var start = +new Date();

            Test.app.models.Word.find(filter, function (err, words) {
                var stop = +new Date();
                console.log('query time loopback: ' + (stop - start).toString());
                if (err) {
                    console.log(err);
                    next();
                    return;
                }
                console.log('words ' + words.length.toString());

                const ids = [];

                start = +new Date();

                loopwords: for (var i = 0; i < words.length && ids.length < limit; i++) {

                    if (selection === 1) {
                        const questions = words[i].questions();
                        for (var j=0;j<questions.length;j++) {
                            //console.log('question found');
                            if (questions[j].answers().length > 0) {
                                //console.log('answer found');
                                continue loopwords;
                            }
                        }
                    }

                    var singular = (Math.random() < 0.5) ? false : true;

                    const translations1 = words[i].translations1();
                    const translations2 = words[i].translations2();

                    if (words[i].wordTypeId === 19) {
                        singular = true;
                    }
                    else {
                        var found = false;

                        for (var j = 0; !found && j < translations1.length; j++) {
                            if ((singular && translations1[j].singular !== '') || (!singular && translations1[j].plural !== '')) {
                                found = true;
                            }
                        }

                        for (var j = 0; !found && j < translations2.length; j++) {
                            if ((singular && translations2[j].singular !== '') || (!singular && translations2[j].plural !== '')) {
                                found = true
                            }
                        }

                        singular = (found) ? singular : !singular;
                    }

                    if (translations1.length > 0 || translations2.length > 0) {
                        ids.push({id: words[i].id, singular: singular});
                    }
                }

                stop = +new Date();
                console.log('filter time loopback: ' + (stop - start).toString());

                ctx.args.data['lastQuestion'] = 0;
                ctx.args.data['numQuestions'] = ids.length;

                console.log('ids.length',ids.length);

                ctx.session = {ids: ids};

                next();
            });
        }

        /*var query = "SELECT word1Id, word1.languageId AS languageId1, word2Id, word2.languageId AS languageId2, word1.*, word2.* " +
            "FROM Translation " +
            "JOIN Word AS word1 ON word1Id=word1.id " +
            "JOIN Word AS word2 ON word2Id=word2.id " +
            // "JOIN WordType AS WT1 ON word1.wordTypeId=WT1.id " +
            // "JOIN WordType AS WT2 ON word2.wordTypeId=WT2.id " +
            // "WHERE ((word1.languageId=? AND word2.languageId=?) OR (word1.languageId=? AND word2.languageId=?)) AND WT1.name in (?) AND WT1.id = WT2.id;";
            "WHERE ((word1.languageId=? AND word2.languageId=?) OR (word1.languageId=? AND word2.languageId=?)) AND word1.wordTypeId in (?) AND word1.wordTypeId = word2.wordTypeId;";

        var params = [
            ctx.args.data.languageAnswerId,
            ctx.args.data.languageQuestionId,
            ctx.args.data.languageQuestionId,
            ctx.args.data.languageAnswerId,
            ctx.args.data.wordTypeIds
        ];

        Test.app.dataSources.langua.connector.execute(query,params,function(err, results)
        {
            if (err)
            {
                console.log(err);
                return;
            }

            var ids = [];

            console.log(results.length);
            console.log(results[0]);

            for (var i=0; i<results.length; i++)
            {
                var singular = (Math.random() < 0.5) ? true : false;

                if (results[i].languageId1 === ctx.args.data.languageAnswerId && ids.indexOf(results[i].word1Id) === -1)
                    ids.push(results[i].word1Id);
                else if (results[i].languageId2 === ctx.args.data.languageAnswerId && ids.indexOf(results[i].word2Id) === -1)
                    ids.push(results[i].word2Id);
            }

            ctx.session = { ids: ids };

            ctx.args.data['lastQuestion'] = 0;
            ctx.args.data['numQuestions'] = (ids.length < 20) ? ids.length : 20;

            for (var key in testObject)
                console.log(key);

            next();
        });*/
    });

    Test.afterRemote('create', function (ctx, testInstance, next) {

        console.log('afterCreate');

        var ids = ctx.session.ids;

        for (var i = 0; i < ids.length; i++) {
            //console.log(ids[i].singular ? 'ev' : 'mv');
            var question = {wordId: ids[i].id, singular: ids[i].singular, order: (i + 1), memberId: ctx.args.data.memberId}
            testInstance.__create__questions(question, function (err, result) {
                if (err)
                    console.log(err);
            });
        }

        next();
    });

    Test.getQuestion = function (testId, questionPosition, cb) {
        /*Test.findById(testId,{include: {relation: 'questions', scope: {include:'word'}}}, function(err, testInstance) {
            if (err)
            {
                console.log(err);
                cb(err,{});
            }

            var questions = testInstance.questions();

            if (questionPosition > questions.length)
                cb(null,{});

            var question = questions[questionPosition - 1];

            cb(null, question);
        });*/

        const Question = Test.app.models.Question;
        Question.findOne({
            where: {
                and: [
                    {testId: testId},
                    {order: questionPosition}
                ]
            }, include: {
                relation: 'word', scope: {
                    include: ['translations1', 'translations2']
                }
            }
        }, function (err, question) {
            if (err) {
                console.log(err);
                cb(err, null);
                return;
            }
            if (question) {
                const word = question.word();
                //for (var key in word)
                //  console.log(key);
                word.translations = word.translations1().concat(word.translations2());
                word.unsetAttribute('translations2');
                cb(null, question);
                return;
            }
            cb(null, null);
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

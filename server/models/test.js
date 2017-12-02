'use strict';

module.exports = function(Test) {



    Test.beforeRemote('create', function(ctx, testObject, next) {

        console.log('beforerCreate');

        Test.app.models.Word.find({
            include: [
                'wordType',
                'translations1',
                'translations2'
            ],
            where: {
                and: [
                    {languageId: ctx.args.data.languageAnswerId},
                    {'wordType.name': 'WW'}
                ]
            }
        }, function(err, words) {
            if (err)
                console.log(err);

            console.log(words.length);

            console.log(words[0]);

            next();
        });

        /*Test.app.models.WordType.find({
            include: {
                relation: 'words',
                scope: {
                    include: [
                        {
                            relation: 'translations1',
                            scope: {
                                where: {
                                    languageId: ctx.args.languageQuestionId
                                }
                            }
                        },
                        {
                            relation: 'translations2',
                            scope: {
                                where: {
                                    languageId: ctx.args.languageQuestionId
                                }
                            }
                        }
                    ],
                    where: {
                        languageId: ctx.args.data.languageAnswerId
                    }
                }
            },
            where: {
                name: {inq: ctx.args.data.wordTypes}
            }
        }, function(err, wordTypes) {
            if (err)
                console.log(err);

            var ids = [];

            for (var i=0;i<wordTypes.length;i++)
            {
                var words = wordTypes[i].words();

                var translations = words.translations1();

                for (var j=0;j<translations.length;j++)
                {
                    var id = translations[j].id;
                    if (ids.indexOf(id) === -1)
                        ids.push(id);
                }

                translations = words.translations2();
                for (var j=0;j<translations.length;j++)
                {
                    var id = translations[j].id;
                    if (ids.indexOf(id) === -1)
                        ids.push(id);
                }
            }

            ctx.session = { ids: ids };

            next();
        });*/
    });

    Test.afterRemote('create', function(ctx, testInstance, next) {

        console.log('afterCreate');

        //console.log(ctx.session.ids);

        next();
    });

};

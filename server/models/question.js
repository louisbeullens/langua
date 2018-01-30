'use strict';

module.exports = function(Question) {

    Question.beforeRemote('prototype.__create__answers', function(ctx, unused, next) {

        ctx.args.data.valid = false;

        Question.findById(ctx.req.params.id, {include:['test','word','conjugation']} ,function(err, question) {
            if (err) {
                return next(err);
            }

            if (question) {

                var validAnswer = '';

                const test = question.test();

                if (test.type === 'T') {
                    const word = question.word();

                    if (question.form === 'S') {
                        if (word.articleSingular !== '')
                            validAnswer += word.articleSingular + ' ';
                        validAnswer += word.singular;
                    } else {
                        if (word.articlePlural !== '')
                            validAnswer += word.articlePlural + ' ';
                        validAnswer += word.plural;
                    }
                } else if (test.type === 'C') {
                    validAnswer = question.conjugation()['form'+question.form];
                }

                if (question.order > test.lastQuestion) {
                    test.lastQuestion = question.order;
                }

                if (ctx.args.data.answer === validAnswer){
                    ctx.args.data.valid = true;
                    test.validAnswers++;
                }

                ctx.args.data.test = test;

                test.save(function(err, test) {
                    next();
                });
            }
            else {
                next();
            }
        });
    });

};

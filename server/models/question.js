'use strict';

module.exports = function(Question) {

    Question.beforeRemote('prototype.__create__answers', function(ctx, unused, next) {

        console.log('beforeQuestionCreateAnswer');

        ctx.args.data.valid = false;

        Question.findById(ctx.req.params.id, {include:['test','word']} ,function(err, question) {
            if (err) {
                console.log(err);
                next();
                return
            }

            if (question) {

                var validAnswer = '';
                const word = question.word();

                if (question.singular) {
                    if (word.articleSingular !== '')
                        validAnswer += word.articleSingular + ' ';
                    validAnswer += word.singular;
                } else {
                    if (word.articlePlural !== '')
                        validAnswer += word.articlePlural + ' ';
                    validAnswer += word.plural;
                }

                const test = question.test();
                if (question.order > test.lastQuestion) {
                    test.lastQuestion = question.order;
                }

                if (ctx.args.data.answer === validAnswer){
                    ctx.args.data.valid = true;
                    test.validAnswers++;
                }

                test.save();

                ctx.args.data.test = test;
            }
            next();
        });
    });

};

'use strict';

module.exports = function(Question) {

    Question.beforeRemote('create', function(ctx, testInstance, next) {

        console.log('beforeQuestionCreate');

        console.log(testInstance);

        next();
    });

};

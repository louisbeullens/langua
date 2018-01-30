'use strict';

module.exports = function(Word) {
    Word.prototype.translations = function(id,cb) {
        Word.findById(id,{include:['translations1','translations2']}, function(err,word) {
            if (err) {
                return cb(err, []);
            }
            cb(null,word.translations1().concat(word.translations2()));
        });
    };

    Word.remoteMethod(
        'translations', {
            accepts: [
                {arg: 'id', type: 'number', required: true}
            ],
            http: {path: '/:id/translations', verb: 'get'},
            returns: {type:[Word], root:true}
        }
    );
};

'use strict';

//var app = require('loopback');
//var app = require('../../server/server');

module.exports = function(Word) {
    Word.prototype.translations = function(id,cb) {
        Word.findById(id,{include:['translations1','translations2']}, function(err,word) {
            if (err) {
                console.log(err);
                cb(null,[]);
                return;
            }
            cb(null,word.translations1().concat(word.translations2()));
        });
        //cb(null, 'All translations for word: ' + id.toString() + ' will be available soon.');
    };

    Word.remoteMethod(
        'translations', {
            accepts: [
                {arg: 'id', type: 'number', required: true}
            ],
            // mixing ':id' into the rest url allows $owner to be determined and used for access control
            http: {path: '/:id/translations', verb: 'get'},
            returns: {type:[Word], root:true}
        }/*{
                accepts: [
                    {arg: 'id', type: 'number', required:true}
                ],
                path: '/AllTranslation',
                verb: 'get',
            returns: {
                arg: 'translations',
                type: 'string'
            }
        }*/
    );
};

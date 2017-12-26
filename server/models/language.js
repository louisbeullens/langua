'use strict';

module.exports = function(Language) {

    Language.getWordTypes = function(id, cb) {

        // (LEFT) JOIN wel nodig?
        var sql = "SELECT DISTINCT WordType.id, WordType.name FROM Word JOIN WordType ON wordTypeId=WordType.id WHERE languageId=? AND wordTypeId != 0 ORDER BY WordType.id;";

        Language.app.dataSources.langua.connector.execute(sql,[id], function(err, results) {
            if (err)
            {
                console.log(err);
                cb(err,[]);
            }

            var wordTypes = [];

            for (var i=0; i<results.length; i++)
            {
                wordTypes.push( {id: results[i].id, name: results[i].name } );
            }

            cb(null,wordTypes);
        })
    }

    Language.remoteMethod('getWordTypes', {
        http: { path: '/:id/wordTypes', verb: 'get' },
        accepts: { arg: 'id', type: 'number' },
        returns: { type: '[WordType]', root:true }
    });

    Language.getTenses = function(id, cb) {

        var sql = "SELECT DISTINCT Tense.id, Tense.name, Tense.order FROM Conjugation JOIN Tense ON tenseId=Tense.id WHERE languageId=? ORDER BY Tense.order ASC;";

        Language.app.dataSources.langua.connector.execute(sql,[id], function(err, results) {
            if (err)
            {
                console.log(err);
                cb(err,[]);
            }

            var Tenses = [];

            for (var i=0; i<results.length; i++)
            {
                Tenses.push( {id: results[i].id, name: results[i].name } );
            }

            cb(null,Tenses);
        })
    }

    Language.remoteMethod('getTenses', {
        http: { path: '/:id/tenses', verb: 'get' },
        accepts: { arg: 'id', type: 'number' },
        returns: { type: '[Tense]', root:true }
    });

};

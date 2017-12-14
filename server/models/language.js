'use strict';

module.exports = function(Language) {

    Language.getWordTypes = function(id, cb) {

        var sql = "SELECT DISTINCT WordType.id, WordType.name FROM Word LEFT JOIN WordType ON wordTypeId=WordType.id WHERE languageId=? AND wordTypeId != 0 ORDER BY WordType.id;";

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

};

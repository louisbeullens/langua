'use strict';

var app = require('../../server/server');

module.exports = function(Member) {

    Member.emailExists = function (email, cb) {
        Member.findOne({where:{email:email}}, function(err,result) {
            cb(err,(result) ? true: false);
            return;
        });
    }

    Member.anonymousLogin = function (req,cb) {

        console.log(req.connection.remoteAddress);

        var rand = Math.floor(Math.random()*10000).toString();
        var date = new Date(Date.now());
        rand = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString() + date.getUTCDate().toString() + '.' + date.getUTCHours().toString() + date.getUTCMinutes().toString() + date.getUTCSeconds().toString() + '.' + date.getUTCMilliseconds().toString() + '.' + rand;
        rand = rand + '@langua.be';
        Member.create({email:rand,password:rand}, function(err,newMember) {
            if (err)
                console.log(err);

            console.log(newMember);

            Member.login({email: newMember.email, password:rand}, function(err,accessToken) {
                if (err)
                    console.log(err);

                console.log(accessToken);

                cb(null,accessToken)
            });
        });
        return;
    }

    Member.remoteMethod(
        'emailExists', {
            accepts: [
                {arg: 'email', type: 'string', required: true}
            ],
            http: {path: '/:email/exists', verb: 'get'},
            returns: {type: 'boolean', root: true}
        });

    Member.remoteMethod(
        'anonymousLogin', {
            accepts: [{arg: 'req', type: 'object', 'http': {source: 'req'}}],
            http: {path: '/anonymousLogin', verb: 'get'},
            returns: {type: 'AccessToken', root: true}
        });

};

'use strict';

var app = require('../../server/server');
const http = require('http');

module.exports = function(Member) {

    Member.emailExists = function (email, cb) {
        Member.findOne({where:{email:email}}, function(err,result) {
            cb(err,(result) ? true: false);
            return;
        });
    }

    Member.anonymousLogin = function (req,cb) {

        console.log(req.ip);

        var rand = Math.floor(Math.random()*10000).toString();
        var date = new Date(Date.now());
        rand = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString() + date.getUTCDate().toString() + '.' + date.getUTCHours().toString() + date.getUTCMinutes().toString() + date.getUTCSeconds().toString() + '.' + date.getUTCMilliseconds().toString() + '.' + rand;
        rand = rand + '@langua.be';
        Member.create({email:rand,password:rand}, function(err,newMember) {
            if (err)
                console.log(err);

            console.log(newMember);

            Member.login({email: newMember.email, password:newMember.email}, function(err,accessToken) {
                if (err)
                    console.log(err);

                console.log(accessToken);

                cb(null,accessToken)
            });
        });
        return;
    }

    Member.afterRemote('login', logIpAddress);
    Member.afterRemote('anonymousLogin', logIpAddress);

    function logIpAddress(ctx, accessToken, next) {
        console.log('User with id: ' + accessToken.userId + ' logged in form ip: ' + ctx.req.ip);

        http.get('http://freegeoip.net/json/84.196.187.163', function(res) {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];

            /*let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.log(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
            console.log(parsedData);
        } catch (e) {
                console.log(e.message);
            }
        });
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);*/

            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', function(chunk) {
                rawData += chunk;
            });
            res.on('end', function() {
                var ipLocation = JSON.parse(rawData);
                ipLocation.memberId = accessToken.userId;
                app.models.IpLocation.findOne({where:{
                    and:[
                        {ip: ipLocation.ip},
                        {memberId:accessToken.userId},
                        {latitude: ipLocation.latitude},
                        {longitude: ipLocation.longitude}
                    ]}}, function(err, result) {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (! result) {
                        app.models.IpLocation.create(ipLocation, function(err) {
                            if (err)
                                console.log(err);
                        });
                    }
                })
            });
        });
        next();
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

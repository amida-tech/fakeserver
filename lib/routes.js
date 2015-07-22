var express = require('express');
var app = module.exports = express();
var async = require('async');
var config = require('../config');

var d = new Date;
var month = d.getMonth() + 1;
if ((d.getMonth() + 1) < 10) {
    month = "0" + (d.getMonth() + 1);
}
var samplereportid = "123456789";
var samplereportdate = d.getFullYear() + '-' + month + '-' + d.getDate() + 'T10:37:23.000-0400';

var timeoutLength = 5 * 1000;

var Base64 = {

    keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this.keyStr.charAt(enc1) +
                this.keyStr.charAt(enc2) +
                this.keyStr.charAt(enc3) +
                this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            console.log("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
    }
};

var checkAuth = function (authHeader, callback) {
    var auth = authHeader.split(" ")[1];
    var decodeAuth = Base64.decode(auth).split(":");
    var username = decodeAuth[0];
    var password = decodeAuth[1];

    var userExists = false;
    var userAuth = false;
    var usertype = "";
    async.eachSeries(config.users, function (user, cb) {
        if (user.username === username) {
            userExists = true;
            if (user.password === password) {
                userAuth = true;
                usertype = user.usertype;
                cb();
            } else {
                cb();
            }
        } else {
            cb();
        }
    }, function (err) {
        if (userAuth) {
            callback(null, usertype);
        } else {
            if (userExists) {
                callback("wrong password");
            } else {
                callback("bad request");
            }
        }
    })
};

app.post('/mhv-portal-web/mhv.portal', function (req, res) {
    //console.log("header: " + JSON.stringify(req.headers, null, 4));
    //console.log("authorization decode: " + Base64.decode(req.headers.authorization.split(" ")[1]));
    //console.log("query: " + JSON.stringify(req.query, null, 4));

    checkAuth(req.headers.authorization, function (err, usertype) {
        if (err) {
            console.log(err);
            setTimeout(function () {
                res.status(400).end();
            }, timeoutLength);
        } else {
            if (req.query.operation) {
                if (usertype === 'basic') {
                    setTimeout(function () {
                        //This is a unique thing that MHV responds with if a basic user requests a premium report
                        res.status(200).send('An unexpected error has occurred');
                    }, timeoutLength);
                } else {
                    if (req.query.operation === 'downloadHealthHistoryData') {
                        console.log('sample report date: ' + samplereportdate);
                        setTimeout(function () {
                            res.send('Your information update is complete.  <td nowrap="nowrap">mhv_VA_CCD_SAMPLE_20150714_1037</td> <a href="javascript:setValue(\'' + samplereportdate + '\',\'xml\')"></a>');
                        }, timeoutLength);
                    } else {
                        setTimeout(function () {
                            res.status(400).end();
                        }, timeoutLength);
                    }
                }
            } else {
                setTimeout(function () {
                    res.status(200).send('<a href="mhv-portal-web/mhv.portal?_nfpb=true&_pageLabel=downloadData&downloadData_actionOverride=/gov/va/med/mhv/usermgmt/downloadYourData/viewPDFReport&downloadDatareportId=' + samplereportid + '" class="mhv-input-button" style="text-decoration: none; display: inline-block; margin: 0px;" onclick="mhv_wt_track(7);">View/Print</a>');
                }, timeoutLength);
            }
        }
    });
});

app.post('/mhv-portal-web/downloadData', function (req, res) {
    //console.log("header: " + JSON.stringify(req.headers, null, 4));
    //console.log("authorization decode: " + Base64.decode(req.headers.authorization.split(" ")[1]));
    //console.log("query: " + JSON.stringify(req.query, null, 4));

    checkAuth(req.headers.authorization, function (err, usertype) {
        if (err) {
            console.log(err);
            setTimeout(function () {
                res.status(400).end();
            }, timeoutLength);
        } else {
            if (req.query.reportId && req.query.downloadFormat) {
                if (req.query.reportId === samplereportid) {
                    if (req.query.downloadFormat === 'bbFormat' || req.query.downloadFormat === 'textFormat' || req.query.downloadFormat === 'pdfFormat') {
                        if (req.query.downloadFormat === 'pdfFormat') {
                            //res.send('Would send pdf');
                            setTimeout(function () {
                                res.status(200).sendFile('VA_My_HealtheVet_Blue_Button_Sample_Version_12_10.pdf', {
                                    root: './files/'
                                })
                            }, timeoutLength);
                        } else {
                            setTimeout(function () {
                                res.status(200).sendFile('VA_My_HealtheVet_Blue_Button_Sample_Version_12_10.txt', {
                                    root: './files/'
                                });
                            }, timeoutLength);
                        }
                    } else {
                        setTimeout(function () {
                            res.status(400).end();
                        }, timeoutLength);
                    }
                } else {
                    setTimeout(function () {
                        res.status(400).end();
                    }, timeoutLength);
                }
            } else {
                setTimeout(function () {
                    res.status(400).end();
                }, timeoutLength);
            }
        }
    });
});

app.post('/mhv-portal-web/downloadCCDData', function (req, res) {
    //console.log("header: " + JSON.stringify(req.headers, null, 4));
    //console.log("authorization decode: " + Base64.decode(req.headers.authorization.split(" ")[1]));
    //console.log("query: " + JSON.stringify(req.query, null, 4));

    checkAuth(req.headers.authorization, function (err, usertype) {
        if (err) {
            console.log(err);
            setTimeout(function () {
                res.status(400).end();
            }, timeoutLength);
        } else {
            if (usertype === 'basic') {
                setTimeout(function () {
                    res.status(400).end();
                }, timeoutLength);
            } else {
                if (req.query.requestDate && req.query.downloadFormat) {
                    if (req.query.requestDate === samplereportdate) {
                        if (req.query.downloadFormat === 'xml' || req.query.downloadFormat === 'pdf') {
                            if (req.query.downloadFormat === 'pdf') {
                                setTimeout(function () {
                                    res.status(200).sendFile('VA_My_HealtheVet_CCD_Sample_Version_12_10.pdf', {
                                        root: './files/'
                                    });
                                }, timeoutLength);
                            } else {
                                setTimeout(function () {
                                    res.set('Content-Type', 'text/xml');
                                    res.status(200).sendFile('VA_My_HealtheVet_CCD_Sample_Version_12_10.xml', {
                                        root: './files/'
                                    });
                                }, timeoutLength);
                            }
                        } else {
                            setTimeout(function () {
                                res.status(400).end();
                            }, timeoutLength);
                        }
                    } else {
                        setTimeout(function () {
                            res.status(400).end();
                        }, timeoutLength);
                    }
                } else {
                    setTimeout(function () {
                        res.status(400).end();
                    }, timeoutLength);
                }
            }
        }
    });
});
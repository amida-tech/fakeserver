var express = require('express');
var app = module.exports = express();
var async = require('async');
var config = require('../config');
var Base64 = require('./base64');

var d = new Date;
var month = d.getMonth() + 1;
if ((d.getMonth() + 1) < 10) {
    month = "0" + (d.getMonth() + 1);
}
var samplereportid = "123456789";
var samplereportdate = d.getFullYear() + '-' + month + '-' + d.getDate() + 'T10:37:23.000-0400';

var timeoutLength = process.env.FAKE_DELAY || 3 * 1000;

var checkAuth = function (authHeader, callback) {
    if (authHeader) {
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
    } else {
        callback("no auth header");
    }
};

app.post('/mhv-portal-web/mhv.portal', function (req, res) {
    checkAuth(req.headers.authorization, function (err, usertype) {
        if (err) {
            console.log(err);
            setTimeout(function () {
                res.status(401).end();
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
                        setTimeout(function () {
                            res.send('Your information update is complete.  <td nowrap="nowrap">mhv_VA_CCD_SAMPLE_20150714_1037</td> <a href="javascript:setValue(\'' + samplereportdate + '\',\'xml\')"></a>');
                        }, timeoutLength);
                    } else {
                        setTimeout(function () {
                            res.status(401).end();
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

    checkAuth(req.headers.authorization, function (err, usertype) {
        if (err) {
            console.log(err);
            setTimeout(function () {
                res.status(401).end();
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
                            res.status(401).end();
                        }, timeoutLength);
                    }
                } else {
                    setTimeout(function () {
                        res.status(401).end();
                    }, timeoutLength);
                }
            } else {
                setTimeout(function () {
                    res.status(401).end();
                }, timeoutLength);
            }
        }
    });
});

app.post('/mhv-portal-web/downloadCCDData', function (req, res) {

    checkAuth(req.headers.authorization, function (err, usertype) {
        if (err) {
            console.log(err);
            setTimeout(function () {
                res.status(401).end();
            }, timeoutLength);
        } else {
            if (usertype === 'basic') {
                setTimeout(function () {
                    res.status(401).end();
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
                                res.status(401).end();
                            }, timeoutLength);
                        }
                    } else {
                        setTimeout(function () {
                            res.status(401).end();
                        }, timeoutLength);
                    }
                } else {
                    setTimeout(function () {
                        res.status(401).end();
                    }, timeoutLength);
                }
            }
        }
    });
});
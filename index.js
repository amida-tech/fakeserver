var express = require('express');
var app = express();
var config = require('./config');
var async = require('async');

var d = new Date;
var samplereportid = "123456789";
var samplereportdate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + 'T14%3A02%3A21.000-0400';

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
            res.status(400).end();
        } else {
            if (req.query.operation) {
                if (usertype === 'basic') {
                    res.status(400).end();
                } else {
                    if (req.query.operation === 'downloadHealthHistoryData') {
                        res.send('Your information update is complete.  <a href="/mhv-portal-web/mhv.portal?_nfpb=true&_pageLabel=downloadData&downloadData_actionOverride=/gov/va/med/mhv/usermgmt/downloadYourData/viewCCDReport&requestDate=' + samplereportdate + '" class="mhv-input-button" style="text-decoration: none">View/Print</a></div>');
                    } else {
                        res.status(400).end();
                    }
                }
            } else {
                res.send('<a href="javascript:setValue(' + samplereportid + ',\'pdfFormat\')" class="mhv-input-button" style="text-decoration: none; display: inline-block; padding-left: 0px; padding-right: 0px; width: 187px; margin: 0px;" onclick="mhv_wt_track(9);">Download PDF File</a>');
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
            res.status(400).end();
        } else {
            if (req.query.reportId && req.query.downloadFormat) {
                if (req.query.reportId === samplereportid) {
                    if (req.query.downloadFormat === 'bbFormat' || req.query.downloadFormat === 'textFormat' || req.query.downloadFormat === 'pdfFormat') {
                        if (req.query.downloadFormat === 'pdfFormat') {
                            res.send('Would send pdf');
                        } else {
                            res.send('Would send ASCII');
                        }
                    } else {
                        res.status(400).end();
                    }
                } else {
                    res.status(400).end();
                }
            } else {
                res.status(400).end();
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
            res.status(400).end();
        } else {
            if (usertype === 'basic') {
                res.status(400).end();
            } else {
                if (req.query.reportId && req.query.downloadFormat) {
                    if (req.query.requestDate === samplereportdate) {
                        if (req.query.downloadFormat === 'xml' || req.query.downloadFormat === 'pdf') {
                            if (req.query.downloadFormat === 'pdf') {
                                res.send('Would send pdf');
                            } else {
                                res.send('Would send xml');
                            }
                        } else {
                            res.status(400).end();
                        }
                    } else {
                        res.status(400).end();
                    }
                } else {
                    res.status(400).end();
                }
            }
        }
    });
});

//POST
//var d = new Date();
//www.myhealth.va.gov/mhv-portal-web/mhv.portal?_nfpb=true&_windowLabel=downloadData&downloadData_actionOverride=%2Fgov%2Fva%2Fmed%2Fmhv%2Fusermgmt%2FdownloadYourData%2FdownloadSelectionsReport&_pageLabel=downloadData&downloadDatawlw-radio_button_group_key%3A%7BactionForm.pickDate%7D=downloadSelectedDateRanges&downloadDatawlw-select_key%3A%7BactionForm.fromDateMonth%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.fromDateMonth%7D=1&downloadDatawlw-select_key%3A%7BactionForm.fromDateDay%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.fromDateDay%7D=1&downloadDatawlw-select_key%3A%7BactionForm.fromDateYear%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.fromDateYear%7D=1895&downloadDatawlw-select_key%3A%7BactionForm.toDateMonth%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.toDateMonth%7D=1&downloadDatawlw-select_key%3A%7BactionForm.toDateDay%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.toDateDay%7D=10&downloadDatawlw-select_key%3A%7BactionForm.toDateYear%7DOldValue=true&downloadDatawlw-select_key%3A%7BactionForm.toDateYear%7D=1980&downloadDatawlw-radio_button_group_key%3A%7BactionForm.pickDataClasses%7D=downloadAllDataClasses&downloadDatawlw-checkbox_key%3A%7BactionForm.futureappointments%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.pastappointments%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.appointmentsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.appointmentsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.prescriptions%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.medications%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.medsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.medsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vachemlabs%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vapathology%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.varadiology%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vaekg%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.labsandtests%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.labsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.labsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vaproblemlist%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vaadmissionsanddischarges%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vaprogressnotes%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.wellness%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.wellnesshistoryall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.wellnesshistoryall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vaallergies%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.seiallergies%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.allergiesall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.allergiesall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vaimmunizations%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.immunizations%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.immunizationsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.immunizationsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vavitals%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vitalsandreadings%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vitalsandreadingsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.vitalsandreadingsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.medicalevents%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.familyhealthhistory%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.militaryhealthhistory%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.treatmentfacilities%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthcareproviders%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthhistoryall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthhistoryall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.activityjournal%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.foodjournal%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.foodactivityall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.foodactivityall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.currentgoals%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.completedgoals%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.goalsall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.goalsall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.vademographics%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.seidemographics%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.healthinsurance%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.demohealthall%7DOldValue=false&downloadDatawlw-checkbox_key%3A%7BactionForm.demohealthall%7D=on&downloadDatawlw-checkbox_key%3A%7BactionForm.dodmilitaryservice%7DOldValue=false
//response: <a href="javascript:setValue(54531063439,'pdfFormat')" class="mhv-input-button" style="text-decoration: none; display: inline-block; padding-left: 0px; padding-right: 0px; width: 187px; margin: 0px;" onclick="mhv_wt_track(9);">Download PDF File</a>

//POST (basic files)
//www.myhealth.va.gov/mhv-portal-web/downloadData?reportId=" + recordId + "&downloadFormat=textFormat //pdfFormat
//response: file


//POST (check for daily)
//www.myhealth.va.gov/mhv-portal-web/mhv.portal?_nfpb=true&_windowLabel=downloadData&downloadData_actionOverride=%2Fgov%2Fva%2Fmed%2Fmhv%2Fusermgmt%2FdownloadYourData%2FdownloadReport&_pageLabel=downloadData&operation=downloadHealthHistoryData
//response: Your information update is complete.  <a href="https://www.myhealth.va.gov:443/mhv-portal-web/mhv.portal?_nfpb=true&_pageLabel=downloadData&downloadData_actionOverride=/gov/va/med/mhv/usermgmt/downloadYourData/viewCCDReport&requestDate=2015-07-15T14%3A02%3A21.000-0400" class="mhv-input-button" style="text-decoration: none">View/Print</a></div>


//POST (Download advanced)
//https://myhealth.va.gov/mhv-portal-web/downloadCCDData?patientId=&requestDate=2015-07-15T14%3A02%3A21.000-0400&downloadFormat=xml
//response: file

app.get('/', function (req, res) {
    res.send(config.description);
});

var server = app.listen(config.port, config.address, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Fake server listening at http://%s:%s', host, port);
});
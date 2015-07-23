var expect = require("chai").expect;
var request = require('supertest');
var config = require('../config');
var base64 = require('../lib/base64');

describe("Routes", function () {
    this.timeout(10000);
    var url = 'http://localhost:3000';
    describe("Basic User", function () {
        var user = {
            username: 'daniel',
            password: 'testtest'
        };
        var basicId = '';
        it('should return a report id', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    var re = /(?:reportId=)([0-9]{1,})/igm;
                    var recordId = re.exec(res.text);
                    basicId = recordId[1];
                    expect(res.status).to.equal(200);
                    expect(recordId).to.not.equal(null);
                    done();
                });
        });
        it('should return OK but with an error message', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal?operation=downloadHealthHistoryData')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(200);
                    expect(res.text).to.equal('An unexpected error has occurred');
                    done();
                });
        });
        it('should download a PDF with the report id from earlier', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=' + basicId + '&downloadFormat=pdfFormat')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(200);
                    expect(res.headers['content-type']).to.equal('application/pdf');
                    done();
                });
        });
        it('should download a text file with the report id from earlier', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=' + basicId + '&downloadFormat=textFormat')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(200);
                    expect(res.headers['content-type']).to.contain('text/plain');
                    done();
                });
        });
    });
    describe("Advanced User", function () {
        var user = {
            username: 'isabella',
            password: 'testtest'
        };
        var advancedId = '';
        var advancedDate = '';
        it('should return a report id', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    var re = /(?:reportId=)([0-9]{1,})/igm;
                    var recordId = re.exec(res.text);
                    if (recordId !== null) {
                        advancedId = recordId[1];
                    }
                    expect(res.status).to.equal(200);
                    expect(recordId).to.not.equal(null);
                    done();
                });
        });
        it('should return OK with a record and message', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal?operation=downloadHealthHistoryData')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(200);
                    //res.send('Your information update is complete.  <td nowrap="nowrap">mhv_VA_CCD_SAMPLE_20150714_1037</td> <a href="javascript:setValue(\'' + samplereportdate + '\',\'xml\')"></a>');
                    var dateRE = /(?:javascript:setValue\(')([0-9\-T:.]{1,})/;
                    var requestDate = dateRE.exec(res.text);
                    if (requestDate !== null) {
                        advancedDate = requestDate[1];
                    }
                    expect(res.text).to.contain('Your information update is complete');
                    expect(requestDate).to.not.equal(null);
                    done();
                });
        });
        it('should download a PDF with the report id from earlier', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=' + advancedId + '&downloadFormat=pdfFormat')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(200);
                    expect(res.headers['content-type']).to.equal('application/pdf');
                    done();
                });
        });
        it('should download a text file with the report id from earlier', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=' + advancedId + '&downloadFormat=textFormat')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(200);
                    expect(res.headers['content-type']).to.contain('text/plain');
                    done();
                });
        });
    });
    describe("Not a user", function () {
        var user = {
            username: 'hankeveryman',
            password: 'testtest'
        };
        it('should not return a report id and 401', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    var re = /(?:reportId=)([0-9]{1,})/igm;
                    var recordId = re.exec(res.text);
                    expect(res.status).to.equal(401);
                    expect(recordId).to.equal(null);
                    done();
                });
        });
        it('should return 401', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal?operation=downloadHealthHistoryData')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(401);
                    //res.send('Your information update is complete.  <td nowrap="nowrap">mhv_VA_CCD_SAMPLE_20150714_1037</td> <a href="javascript:setValue(\'' + samplereportdate + '\',\'xml\')"></a>');
                    var dateRE = /(?:javascript:setValue\(')([0-9\-T:.]{1,})/;
                    var requestDate = dateRE.exec(res.text);
                    expect(requestDate).to.equal(null);
                    done();
                });
        });
        it('should return 401', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=&downloadFormat=pdfFormat')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(401);
                    done();
                });
        });
        it('should return 401', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=&downloadFormat=textFormat')
                .set('Authorization', 'Basic ' + base64.encode(user.username + ':' + user.password))
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });
    describe("No user", function () {
        it('should not return a report id and 401', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal')
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    var re = /(?:reportId=)([0-9]{1,})/igm;
                    var recordId = re.exec(res.text);
                    expect(res.status).to.equal(401);
                    expect(recordId).to.equal(null);
                    done();
                });
        });
        it('should return 401', function (done) {
            request(url)
                .post('/mhv-portal-web/mhv.portal?operation=downloadHealthHistoryData')
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(401);
                    var dateRE = /(?:javascript:setValue\(')([0-9\-T:.]{1,})/;
                    var requestDate = dateRE.exec(res.text);
                    expect(requestDate).to.equal(null);
                    done();
                });
        });
        it('should return 401', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=&downloadFormat=pdfFormat')
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(401);
                    done();
                });
        });
        it('should return 401', function (done) {
            request(url)
                .post('/mhv-portal-web/downloadData?reportId=&downloadFormat=textFormat')
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });
});
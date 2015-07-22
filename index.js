var express = require('express');
var app = express();
var config = require('./config');
var routes = require('./lib/routes');

app.use(routes);

app.get('/', function (req, res) {
    res.send(config.description);
});

var server = app.listen(config.port, config.address, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Fake server listening at http://%s:%s', host, port);
});
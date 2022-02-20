const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config.js');

const app = express();
const port = process.env.PORT || 8080

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/v1/health/ready', function (req, res) {
    res.json({
        "status": "UP"
    });
});

var server = app.listen(port, function () {
   var host = server.address().address
   console.log("App listening at http://%s:%s", host, port)
});
const newrelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const errorhandler = require('errorhandler');

const app = express();
const port = process.env.PORT || 8080;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// create a rotating write stream
const accessLogStream = rfs.createStream('requests.log', {
  interval: '1d', // daily
  path: path.join(__dirname, 'log'),
});
app.use(morgan('combined', {stream: accessLogStream}));

if (!isProd) {
  app.use(errorhandler());
}

app.use(require('./routes'));

// health check
app.get('/health/ready', (req, res) => {
  res.status(200).json({
    'statusCode': 200,
    'body': {
      'status': 'UP',
    },
  });
});

app.use(function(req, res, next) {
  res.status(404).json({
    'statusCode': 404,
    'body': {
      'message': 'unable to find requested resource',
    },
  });
});

if (!isProd) {
  app.use(function(err, req, res, next) {
    console.error(err.stack);

    const statusCode = err.status || 500;
    res.status(statusCode);

    res.json({
      'message': err.message,
      'error': err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
    'errors': {
      message: err.message,
      error: {},
    }});
});

const server = app.listen(port, function() {
  const host = server.address().address;
  console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;

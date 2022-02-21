const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// create a rotating write stream
const accessLogStream = rfs.createStream('requests.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log'),
});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(require('./routes'));

// health check
app.get('/health/ready', function(req, res) {
  res.status(200).json({
    'statusCode': 200,
    'body': {
      'status': 'UP',
    },
  });
});

const server = app.listen(port, function() {
  const host = server.address().address;
  console.log('App listening at http://%s:%s', host, port);
});

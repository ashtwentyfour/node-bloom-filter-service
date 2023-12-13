const redis = require('redis');
const fs = require('fs');

const redisPort = process.env.REDIS_PORT || 6378;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisAuth = process.env.REDIS_AUTH_STRING;
const redisCAPath = process.env.REDIS_CERT_PATH || '/server-ca.pem';

let redisClient;

(async () => {
  redisClient = redis.createClient({
    password: redisAuth,
    socket: {
      host: redisHost,
      port: redisPort,
      tls: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync(redisCAPath).toString(),
    },
  });

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect(); // connect to Redis instance
})();

module.exports.redisClient = redisClient;

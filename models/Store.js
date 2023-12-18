const redis = require('redis');
const fs = require('fs');

const redisPort = process.env.REDIS_PORT || 6378;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisAuth = process.env.REDIS_AUTH_STRING;
const redisCAPath = process.env.REDIS_CERT_PATH || '/server-ca.pem';
const redisRejectUnauthorized = process.env.REDIS_REJECT_UNAUTH || true;

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: 'rediss://:' + redisAuth + '@' + redisHost + ':' + redisPort,
    socket: {
      tls: true,
      rejectUnauthorized: redisRejectUnauthorized,
      ca: fs.readFileSync(redisCAPath).toString(),
    },
  });

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect(); // connect to Redis instance
})();

module.exports.redisClient = redisClient;

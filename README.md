# Simple Node Express Bloom Filter Service

### The service creates a basic Bloom filter data structure to:

- Insert items
- Lookup items

[Redis](https://redis.io/) is now used by this service to persist the key-value pairs (hash values)

[Memorystore for Redis](https://cloud.google.com/memorystore/docs/redis) was used for testing and must be deployed with 'AUTH' and encrypted connections (using TLS) enabled

## Configuration

The following environment variables can be used to configure the size the Bloom filter:

- `N_ITEMS`: Number of items expected to be stored
- `F_PROB`: False positive probability

Other environment variables:

- `PORT`: Server port (default is `8080`)
- `NODE_ENV`: Environment name (for Production valus is `production`)
- `NEW_RELIC_LICENSE_KEY`: New Relic license key
- `REDIS_PORT`: Redis port number (Default is `6378`)
- `REDIS_HOST`: Redis host/IP (Default is `localhost`)
- `REDIS_AUTH_STRING`: Redis password
- `REDIS_CERT_PATH`: Path to Certificate Authority (`.pem`)
- `REDIS_REJECT_UNAUTH`: Verify certificate Boolean (Default is `true`)

## Install Dependencies

- Install dependencies using:

```
npm install
```

- Run unit tests:

```
npm test
```

- Linting:

```
./node_modules/.bin/eslint .
```

- Build Docker image using:

```
docker build -t node-bloom-filter:latest .
```

## Start Server

- To run locally (Dev mode):

```
npm run dev
```

- Start command:

```
npm start
```

## Endpoints

- To insert an item/string:

```
curl --location -g --request PUT 'http://{{host}}:{{port}}/api/insert' \
--header 'Content-Type: application/json' \
--data-raw '{
    "item": "testitem"
}'
```

- To lookup an item:

```
curl --location -g --request GET 'http://{{host}}:{{port}}/api/testitem'
```

## Deploy to K8s

- Create new secret for the [New Relic License Key](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/)

- Package the Helm chart:

```
cd deployment && helm package .
```

- Base64 encode the `server-ca.pem` file:

```
cat server-ca.pem | base64
```

- Deploy using Helm (example):

```
helm install bloom-filter oci://registry-1.docker.io/ashbourne1990/node-bloom-filter --version 0.0.2 --set redis.auth=UGFzc3dvcmRAMTIzCg== --set redis.tlsca=LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNNekNDQVp5Z0F3SUJBZ0lKQUxpUG5Wc3ZxOGRzTUEwR0NTcUdTSWIzRFFFQkJRVUFNRk14Q3pBSkJnTlYKQkFZVEFsVlRNUXd3Q2dZRFZRUUlFd05tYjI4eEREQUtCZ05WQkFjVEEyWnZiekVNTUFvR0ExVUVDaE1EWm05dgpNUXd3Q2dZRFZRUUxFd05tYjI4eEREQUtCZ05WQkFNVEEyWnZiekFlRncweE16QXpNVGt4TlRRd01UbGFGdzB4Ck9EQXpNVGd4TlRRd01UbGFNRk14Q3pBSkJnTlZCQVlUQWxWVE1Rd3dDZ1lEVlFRSUV3Tm1iMjh4RERBS0JnTlYKQkFjVEEyWnZiekVNTUFvR0ExVUVDaE1EWm05dk1Rd3dDZ1lEVlFRTEV3Tm1iMjh4RERBS0JnTlZCQU1UQTJadgpiekNCbnpBTkJna3Foa2lHOXcwQkFRRUZBQU9CalFBd2dZa0NnWUVBemRHZnhpOUNOYk1mMVVVY3ZEUWg3TVlCCk92ZUlIeWMwRTBLSWJoaks1RmtDQlU0Q2lacmJmSGFnYVc3WkVjTjB0dDNFdnBiT014eGMvWlFVMldOL3Mvd1AKeHBoMHBTZnNmRnNUS000UmhUV0QydjRmZ2sreFppS2QxcDArTDRoVHRwd25FdzB1WFJWZDBraTZtdXdWNXkvUAorNUZIVWVsZHErcGdUY2d6dUs4Q0F3RUFBYU1QTUEwd0N3WURWUjBQQkFRREFnTGtNQTBHQ1NxR1NJYjNEUUVCCkJRVUFBNEdCQUppREFBdFkwbVFRZXV4V2R6TFJ6WG1qdmRTdUw5R295VDNCRi9qU25weHo1LzU4ZGJhOHBXZW4KdjNwajRQM3c1RG9Pc28wcnprWnkyakVzRWl0bFZNMm1MU2JRcE1NK01VVlFDUW9pRzZXOXh1Q0Z1eFNyd1BJUwpwQXFFQXVWNEROb3hRS0tXbWhWditKMHB0TVdEMjVQbnB4ZXE1c1h6Z2hmSm5zbEpsUU5ECi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K --set image.tag=latest@sha256:c371fe411e19712e0436d35cc37d230f855aac75c7c0af4e22ca5a839a752f69 --set redis.host=10.56.208.3
```

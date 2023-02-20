# Simple Node Express Bloom Filter Service

### The service creates a basic Bloom filter data structure to:

- Insert items
- Lookup items

## Configuration

The following environment variables can be used to configure the size the Bloom filter:

- `N_ITEMS`: Number of items expected to be stored
- `F_PROB`: False positive probability

Other environment variables:

- `PORT`: Server port (default is `8080`)
- `NODE_ENV`: Environment name (for Production valus is `production`)
- `NEW_RELIC_LICENSE_KEY`: New Relic license key

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

- Deploy container:

```
docker run --name bloom-filter --env NEW_RELIC_LICENSE_KEY=xxxx -p 8080:8080 node-bloom-filter:latest
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

```
kubectl create secret generic newrelic-key --from-literal=key=XXXX
```

- Deploy using [Helm](https://helm.sh/)

```
cd deployment && helm install node-bloom-filter-service -n bloom-filter --create-namespace .
```
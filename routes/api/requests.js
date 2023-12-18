const express = require('express');
const router = express.Router();
const config = require('../../config.js');

const Obj = require('../../models/Filter.js').BloomFilter;
const bloomFilter = new Obj(config.n_item, config.f_prob);

router.get('/health/ready', async function(req, res, next) {
  try {
    if (bloomFilter.health()) {
      res.status(200).json({
        'statusCode': 200,
        'body': {
          'status': 'UP',
        },
      });
    } else {
      res.status(500).json({
        'statusCode': 500,
        'body': {
          'message': 'error connecting to key-value store',
        },
      });
    }
  } catch (e) {
    next(e);
  }
  return;
});

router.get('/:item', async function(req, res, next) {
  const item = (req.params.item).toString();
  let result;
  try {
    result = await bloomFilter.lookup(item);
  } catch (e) {
    next(e);
  }
  const body = {};
  if (result) {
    body.message = item + ' is probably present';
  } else {
    body.message = item + ' not found';
  }
  res.status(200).json({
    'statusCode': 200,
    'body': body,
  });
  return;
});

router.put('/insert', async function(req, res, next) {
  const item = (req.body.item).toString();
  try {
    await bloomFilter.insert(item);
  } catch (e) {
    next(e);
  }
  res.status(201).json({
    'statusCode': 201,
    'body': {
      'message': 'inserted ' + item,
    },
  });
  return;
});

module.exports = router;

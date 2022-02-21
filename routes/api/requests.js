const express = require('express');
const router = express.Router();
const config = require('../../config.js');

const Obj = require('../../models/Filter.js').BloomFilter;
const bloomFilter = new Obj(config.n_item, config.f_prob);

router.get('/:item', function(req, res) {
  const item = (req.params.item).toString();
  const result = bloomFilter.lookup(item);
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

router.put('/insert', function(req, res) {
  const item = (req.body.item).toString();
  bloomFilter.insert(item);
  res.status(201).json({
    'statusCode': 201,
    'body': {
      'message': 'inserted ' + item,
    },
  });
  return;
});

module.exports = router;

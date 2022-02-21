const express = require('express');
const router = express.Router();
const config = require('../../config.js');

var obj = require('../../models/Filter.js').BloomFilter;
var bloomFilter = new obj(config.n_item, config.f_prob);

router.get('/:item', function (req, res) {
    var item = (req.params.item).toString();
    var result = bloomFilter.lookup(item);
    var body = {};
    if (result) {
        body.message = item + " is probably present";
    } else {
        body.message = item + " not found";
    }
    res.status(200).json({
        "statusCode": 200,
        "body": body
    });
    return;
});

module.exports = router;
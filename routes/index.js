const router = require('express').Router();

router.use('/api', require('./api/requests'));

module.exports = router;

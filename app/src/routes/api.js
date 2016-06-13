'use strict';

const router = require('express').Router();
const fs = require('fs');

router.use('/search', require('altayer/components/search/controller'));


module.exports = router;

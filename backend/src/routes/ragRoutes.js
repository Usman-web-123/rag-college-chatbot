const express = require('express');
const router = express.Router();
const { queryRag } = require('../controllers/ragController');

router.post('/query', queryRag);

module.exports = router;

const express = require('express');
const { addJob } = require('../controllers/demoController');

const router = express.Router();

router.post('/', addJob);

module.exports = router;

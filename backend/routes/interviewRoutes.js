// backend/routes/interviewRoutes.js
const express = require('express');
const { interactWithLambda } = require('../controllers/interviewController');

const router = express.Router();

router.post('/interact', interactWithLambda);

module.exports = router;

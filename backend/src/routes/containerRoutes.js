const express = require('express');
const { getContainers } = require('../controllers/containerController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getContainers));

module.exports = router;

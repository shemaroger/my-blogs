const express = require('express');
const router = express.Router();
const adminDashboardController = require('./controller/adminDashboardController');

// Define the route to get dashboard data
router.get('/dashboard', adminDashboardController.getDashboardData);

module.exports = router;

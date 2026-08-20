const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getNotifications,
  markNotificationRead,
} = require('../controllers/analyticsController');

router.get('/stats', getAnalytics);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getWorkOrders,
  createWorkOrder,
  updateWorkOrder,
  getVerificationQueue,
  verifyQueueItem,
} = require('../controllers/adminController');

// Municipality work orders
router.get('/work-orders', getWorkOrders);
router.post('/work-orders', createWorkOrder);
router.put('/work-orders/:id', updateWorkOrder);

// Road verification desk
router.get('/verification-queue', getVerificationQueue);
router.put('/verification-queue/:id', verifyQueueItem);

module.exports = router;

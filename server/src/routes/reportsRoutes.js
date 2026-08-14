const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getReportById,
  createReport,
  upvoteReport,
  addComment,
  updateReportStatus,
} = require('../controllers/reportsController');

// Reports list & creation
router.get('/', getAllReports);
router.post('/', createReport);

// Report details, comments & upvotes
router.get('/:id', getReportById);
router.post('/:id/upvote', upvoteReport);
router.post('/:id/comments', addComment);
router.put('/:id/status', updateReportStatus);

module.exports = router;

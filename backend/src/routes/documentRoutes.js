const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  reprocessDocument,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocumentById);
router.post('/upload', protect, adminOnly, upload.single('document'), uploadDocument);
router.post('/:id/reprocess', protect, adminOnly, reprocessDocument);
router.delete('/:id', protect, adminOnly, deleteDocument);

module.exports = router;

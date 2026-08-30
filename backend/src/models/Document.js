const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: ['pdf', 'docx', 'txt'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Admissions',
        'Departments',
        'Courses',
        'Fees',
        'Exams',
        'Academic Calendar',
        'Hostel',
        'Library',
        'Clubs',
        'Placements',
        'Scholarships',
        'Policies',
        'Events',
        'Notices',
        'FAQs',
        'General',
      ],
      default: 'General',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'READY', 'FAILED'],
      default: 'PROCESSING',
    },
    filePath: {
      type: String,
      required: true,
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    extractedTextLength: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);

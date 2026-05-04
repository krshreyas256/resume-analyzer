import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: String,
  fileSize: Number,
  fullText: {
    type: String,
    required: true
  },
  analysis: {
    emails: [String],
    phones: [String],
    skills: [String],
    names: [String],
    organizations: [String],
    dates: [String],
    ats_score: Number,
    suggestions: [{
      category: String,
      severity: String,
      message: String
    }]
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Resume', resumeSchema);

const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  manifesto: {
    type: String,
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150', // Placeholder
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);

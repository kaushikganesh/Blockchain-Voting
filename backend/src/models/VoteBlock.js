const mongoose = require('mongoose');

const VoteBlockSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  voterHash: {
    type: String,
    required: true, // SHA-256 of VoterID + ElectionID
  },
  previousHash: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true, // Block hash
  },
  // Security Simulations
  zkProof: {
    type: String, // Simulated ZK Proof
  },
  digitalSignature: {
    type: String, // Simulated ECC Signature
  },
  pqcSignature: {
    type: String, // Simulated Post-Quantum Signature
  }
});

// Since we have multiple elections, making index + election unique might be better, 
// but for a single global blockchain it's fine as `index` globally unique.
// Let's keep `index` globally unique for simplicity of the ledger simulation.

module.exports = mongoose.model('VoteBlock', VoteBlockSchema);

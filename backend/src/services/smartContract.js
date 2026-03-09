const VoteBlock = require('../models/VoteBlock');
const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const CryptoUtility = require('./crypto');
const BlockchainValidator = require('./blockchain');

class SmartContract {
  // Simulates a Solidity contract call to cast a vote
  static async castVote(voterId, electionId, candidateId) {
    // 1. Verify Election is active
    const election = await Election.findById(electionId);
    if (!election || election.status !== 'active') {
      throw new Error('Election is not active.');
    }

    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      throw new Error('Election is outside of the voting period.');
    }

    // 2. Verify Voter Registration
    const user = await User.findById(voterId);
    if (!user || !user.isRegistered) {
      throw new Error('Voter is not properly registered.');
    }

    // 3. Prevent Double Voting (One Vote Per Election Rule)
    // Hash voterId and electionId to protect voter privacy on the ledger
    const voterHash = CryptoUtility.sha256(`${voterId}_${electionId}`);
    
    const existingVote = await VoteBlock.findOne({ voterHash, electionId });
    if (existingVote) {
      throw new Error('Smart Contract Reverted: Voter has already cast a vote in this election.');
    }

    // 4. Verify Candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.electionId.toString() !== electionId.toString()) {
      throw new Error('Invalid candidate or candidate does not belong to this election.');
    }

    // 5. Generate Cryptographic Proofs
    const zkProofObj = CryptoUtility.generateZKProof(voterId, electionId);
    if (!CryptoUtility.verifyZKProof(zkProofObj.proof, electionId)) {
      throw new Error('ZKP Verification failed.');
    }

    const signatureData = `${voterHash}${candidateId}${electionId}`;
    const digitalSignature = CryptoUtility.generateECCSignature(signatureData);
    const pqcSignature = CryptoUtility.generatePQCSignature(signatureData, process.env.PQC_ENABLED === 'true');

    // 6. Mine new block
    let latestBlock = await BlockchainValidator.getLatestBlock();
    let index = 1;
    let previousHash = 'genesis_hash_000000000000';

    if (latestBlock) {
      index = latestBlock.index + 1;
      previousHash = latestBlock.hash;
    }

    const timestamp = new Date();
    const hash = BlockchainValidator.calculateHash(index, previousHash, timestamp.getTime(), voterHash, candidateId, electionId);

    const newVoteBlock = new VoteBlock({
      index,
      timestamp,
      electionId,
      candidateId,
      voterHash,
      previousHash,
      hash,
      zkProof: zkProofObj.proof,
      digitalSignature,
      pqcSignature
    });

    await newVoteBlock.save();

    return {
      success: true,
      message: 'Vote cast successfully and stored on the blockchain.',
      blockHash: hash,
      transactionData: {
        index,
        timestamp,
        zkProof: zkProofObj.proof
      }
    };
  }

  // Simulates contract tallying
  static async tallyVotes(electionId) {
    const blocks = await VoteBlock.find({ electionId });
    
    const results = {};
    let totalVotes = 0;

    blocks.forEach(block => {
      const cId = block.candidateId.toString();
      results[cId] = (results[cId] || 0) + 1;
      totalVotes++;
    });

    return { totalVotes, results };
  }
}

module.exports = SmartContract;

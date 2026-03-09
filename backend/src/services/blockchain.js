const crypto = require('crypto');
const VoteBlock = require('../models/VoteBlock');
const CryptoUtility = require('./crypto');

class BlockchainValidator {
  
  static async getLatestBlock() {
    const latestBlock = await VoteBlock.findOne().sort({ index: -1 });
    return latestBlock;
  }

  static calculateHash(index, previousHash, timestamp, voterHash, candidateId, electionId) {
    const data = `${index}${previousHash}${timestamp}${voterHash}${candidateId}${electionId}`;
    return CryptoUtility.sha256(data);
  }

  static async generateGenesisBlock() {
    const count = await VoteBlock.countDocuments();
    if (count === 0) {
      const genesisBlock = new VoteBlock({
        index: 0,
        timestamp: new Date(),
        voterHash: '0000000000000000000000000000000000000000000000000000000000000000',
        candidateId: null, // No candidate for genesis
        electionId: null,  // No election for genesis
        previousHash: '0',
        hash: this.calculateHash(0, '0', Date.now(), '0000', '0000', '0000'),
        zkProof: 'genesis_proof',
        digitalSignature: 'genesis_sig',
        pqcSignature: 'genesis_pqc'
      });

      // Bypassing mongoose validation for genesis if needed, but the schema allows nulls if we update it.
      // Wait, Schema says candidateId/electionId are required. 
      // Let's create a dummy election and candidate for the genesis block.
    }
  }

  // Verifies the integrity of the chain
  static async isChainValid() {
    const chain = await VoteBlock.find().sort({ index: 1 });
    
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      // Re-calculate hash to ensure data hasn't been tampered with
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        new Date(currentBlock.timestamp).getTime(),
        currentBlock.voterHash,
        currentBlock.candidateId,
        currentBlock.electionId
      );

      if (currentBlock.hash !== calculatedHash) {
        return false;
      }

      // Check if previous Hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = BlockchainValidator;

const VoteBlock = require('../models/VoteBlock');
const User = require('../models/User');

class FraudDetectionAI {

  // Simulate an AI model analyzing voting patterns
  static analyzeVoterBehavior(voterLogs, votingTime, voterId = null) {
    let riskScore = 0;
    const rulesTriggered = [];

    // Rule 1: Abnormal hour voting (e.g., between 2 AM and 4 AM is suspicious)
    const hour = new Date(votingTime).getHours();
    if (hour >= 2 && hour <= 4) {
      riskScore += 20;
      rulesTriggered.push("Abnormal voting hour detected.");
    }

    // Rule 2: Multiple Attempts (Duplicate Vote checking)
    // If the user has already voted, this is a critical fraud attempt in a blockchain system
    if (voterLogs.recentAttempts >= 1) {
      riskScore += 100; // Immediate high risk
      rulesTriggered.push(`Duplicate Vote Attempted: Voter has already cast a ballot in this election.`);
    }

    // Rule 3: High frequency attempts
    if (voterLogs.recentAttempts > 3) {
      riskScore += 50;
      rulesTriggered.push("Multiple rapid voting attempts detected (Bot-like behavior).");
    }

    // Rule 4: Geo-location hopping (Simulated context)
    if (voterLogs.abnormalLocation) {
      riskScore += 40;
      rulesTriggered.push("Voting from multiple geographical locations in a short time frame.");
    }

    return {
      riskScore,
      isSuspicious: riskScore >= 50,
      rulesTriggered
    };
  }

  // Evaluate the entire election for anomalies
  static async evaluateElectionIntegrity(electionId) {
    const blocks = await VoteBlock.find({ electionId }).sort({ timestamp: 1 });
    
    let anomalies = [];
    const timeGaps = [];

    for (let i = 1; i < blocks.length; i++) {
      const gap = new Date(blocks[i].timestamp).getTime() - new Date(blocks[i - 1].timestamp).getTime();
      timeGaps.push(gap);

      // E.g. If votes are spaced exactly 1.000 seconds apart consistently, it's a script
      if (gap < 100) {
        anomalies.push({
          type: "Bot Activity",
          description: `Extremely rapid consecutive votes detected between block ${blocks[i-1].index} and ${blocks[i].index}.`
        });
      }
    }

    // Very basic ML concept: standard deviation of time gaps
    if (timeGaps.length > 10) {
      const avg = timeGaps.reduce((a, b) => a + b) / timeGaps.length;
      const variance = timeGaps.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / timeGaps.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev < 50) {
        anomalies.push({
          type: "Scripted Pattern",
          description: "Vote timing is unnaturally consistent. Possible automated voting script."
        });
      }
    }

    return {
      totalVotesAnalyzed: blocks.length,
      anomaliesFound: anomalies.length,
      anomalies
    };
  }
}

module.exports = FraudDetectionAI;

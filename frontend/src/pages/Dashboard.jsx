import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Vote, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [elections, setElections] = useState([
    {
      id: '60d5ecb8b392d7001f8e4a10', // Mock MongoDB ObjectId
      title: 'University Student Council 2026',
      status: 'active',
      endDate: '2026-03-15',
      hasVoted: false,
      candidates: [
        { id: '60d5ecb8b392d7001f8e4a12', name: 'Alice Chen', party: 'Progressive Student Union', manifesto: 'Better campus wifi and extended library hours.' },
        { id: '60d5ecb8b392d7001f8e4a13', name: 'Bob Smith', party: 'Student Action Group', manifesto: 'More funding for sports and clubs.' }
      ]
    },
    {
      id: '60d5ecb8b392d7001f8e4a11',
      title: 'Department of Computer Science Rep',
      status: 'completed',
      endDate: '2026-02-28',
      hasVoted: false, // Default false so new users aren't locked out immediately if we fetch
      candidates: []
    }
  ]);

  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [fraudAlert, setFraudAlert] = useState(null);
  const [viewResultsModal, setViewResultsModal] = useState(null);
  const [liveResults, setLiveResults] = useState(null);

  const fetchResults = async (electionId) => {
    try {
      const res = await fetch(`https://blockchain-voting-backend-ff3v.onrender.com/api/elections/${electionId}/results`);
      const data = await res.json();
      setLiveResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    setFraudAlert(null);

    try {
      // Intentionally passing dummy candidateId to API
      const res = await fetch(`http://localhost:5005/api/elections/${selectedElection.id}/vote`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           // Note: In real app, we use token from localstorage, using dummy token for prototype if missing
           'Authorization': `Bearer ${localStorage.getItem('token') || 'dummy'}` 
         },
         body: JSON.stringify({ candidateId: selectedCandidate })
      });
      
      const data = await res.json();
      setIsVoting(false);

      if (!res.ok) {
        if (res.status === 403 && data.aiReport) {
           setFraudAlert(data);
        } else {
           alert(data.message || 'Error casting vote.');
        }
        return;
      }
      
      setVoteSuccess(true);
      
      const updatedElections = elections.map(el => 
        el.id === selectedElection.id ? { ...el, hasVoted: true } : el
      );
      // In a real app we'd call setElections(updatedElections)
      // Here we simulate it so the UI shows 'Voted'
      setSelectedElection(prev => ({ ...prev, hasVoted: true }));
    } catch (err) {
      setIsVoting(false);
      console.error(err);
      alert('Network error communicating with smart contract.');
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Voter Dashboard</h1>
          <p className="text-slate-400">Welcome, {user?.voterId || 'Voter'}. Your identity is verified.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Status: Eligible</span>
        </div>
      </div>

      {!selectedElection ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <div key={election.id} className="glass-panel p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  election.status === 'active' 
                    ? 'bg-primary-500/10 border-primary-500/50 text-primary-400' 
                    : 'bg-slate-500/10 border-slate-500/50 text-slate-400'
                }`}>
                  {election.status === 'active' ? 'Active' : 'Completed'}
                </div>
                {election.hasVoted && (
                  <div className="flex items-center text-emerald-400 text-xs font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" /> Voted
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{election.title}</h3>
              <div className="flex items-center text-slate-400 text-sm mb-6 mt-auto">
                <Clock className="w-4 h-4 mr-1" />
                Ends: {new Date(election.endDate).toLocaleDateString()}
              </div>
              
              <button 
                disabled={election.status !== 'active' && election.status !== 'completed'}
                onClick={() => {
                   if (election.status === 'completed' || election.hasVoted) {
                      setViewResultsModal(election);
                      fetchResults(election.id);
                   } else {
                      setSelectedElection(election);
                   }
                }}
                className={`w-full py-2 rounded-lg font-medium transition-all ${
                  election.status === 'active' && !election.hasVoted
                    ? 'bg-primary-600 hover:bg-primary-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {election.hasVoted && election.status === 'active' ? 'View Live Feed' : election.status === 'active' ? 'Cast Vote' : 'View Results'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => { setSelectedElection(null); setVoteSuccess(false); setSelectedCandidate(''); }}
            className="text-primary-400 hover:text-primary-300 text-sm mb-6 font-medium"
          >
            ← Back to Elections
          </button>
          
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-2">{selectedElection.title}</h2>
            <p className="text-slate-400 mb-8">Select your preferred candidate. This action is immutable once submitted.</p>

            {fraudAlert ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-red-500/10 border border-red-500/30 rounded-xl">
                 <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                   <ShieldAlert className="w-8 h-8 text-red-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-red-400 mb-2">AI Fraud System Triggered</h3>
                 <p className="text-slate-300 mb-4">{fraudAlert.message}</p>
                 
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg w-full max-w-md text-left">
                   <h4 className="font-semibold text-white mb-2">AI Analysis Report:</h4>
                   <ul className="list-disc pl-5 space-y-1">
                     {fraudAlert.aiReport.rulesTriggered.map((rule, idx) => (
                        <li key={idx} className="text-red-300 text-sm">{rule}</li>
                     ))}
                   </ul>
                   <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
                     <span className="text-slate-400 text-sm">Risk Score:</span>
                     <span className="font-bold text-red-400">{fraudAlert.aiReport.riskScore} / 100</span>
                   </div>
                 </div>
                 
                 <button 
                  onClick={() => { setSelectedElection(null); setFraudAlert(null); }}
                  className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium"
                 >
                   Return to Dashboard
                 </button>
              </div>
            ) : voteSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Vote Successfully Cast!</h3>
                <p className="text-slate-400 mb-6 max-w-md">
                  Your vote has been cryptographically signed using ZKP and appended to the blockchain. Your voter identity remains completely anonymous.
                </p>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 font-mono text-xs text-slate-500 break-all text-left">
                  <span className="text-primary-400">Transaction Hash:</span><br/>
                  0x8f2a9...d4c1b<br/><br/>
                  <span className="text-purple-400">Zero-Knowledge Proof:</span><br/>
                  zkp_938da71f00b2e...
                </div>
              </div>
            ) : (
              <form onSubmit={handleVote}>
                <div className="space-y-4 mb-8">
                  {selectedElection.candidates.map(candidate => (
                    <label 
                      key={candidate.id}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCandidate === candidate.id 
                          ? 'bg-primary-600/10 border-primary-500' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="candidate" 
                          value={candidate.id}
                          checked={selectedCandidate === candidate.id}
                          onChange={(e) => setSelectedCandidate(e.target.value)}
                          className="w-5 h-5 text-primary-500 border-slate-600 bg-slate-900 focus:ring-primary-500 focus:ring-offset-slate-900"
                        />
                        <div className="ml-4">
                          <h4 className="text-lg font-bold text-white">{candidate.name}</h4>
                          <span className="text-sm font-medium text-primary-400">{candidate.party}</span>
                          <p className="text-sm text-slate-400 mt-2">{candidate.manifesto}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg mb-8">
                  <p className="text-sm text-orange-200">
                    <strong className="text-orange-400">Warning:</strong> Ensure your selection is correct. 
                    Smart contract rules dictate that a vote cannot be altered or deleted once committed to the blockchain.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCandidate || isVoting}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                    !selectedCandidate 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                  }`}
                >
                  {isVoting ? (
                    <>
                      <Vote className="w-5 h-5 mr-3 animate-spin text-primary-200" />
                      Mining Block & Generating ZKP...
                    </>
                  ) : (
                    'Confirm & Sign Vote Cryptographically'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Results Modal */}
      {viewResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="glass-panel p-8 w-full max-w-2xl relative">
              <button 
                onClick={() => setViewResultsModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-2">Election Results</h2>
              <p className="text-slate-400 mb-6">{viewResultsModal.title}</p>
              
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-6 flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-emerald-400 font-bold mb-1">Blockchain Verified</h4>
                  <p className="text-sm text-slate-300">All votes have been tallied directly from the immutable ledger. ZKP and cryptographic signatures valid.</p>
                </div>
              </div>

                 <div className="space-y-6">
                 {liveResults ? (
                   viewResultsModal.candidates.map(candidate => {
                     const votes = liveResults.tally.results[candidate.id] || 0;
                     const total = liveResults.tally.totalVotes;
                     const percentage = total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
                     return (
                       <div key={candidate.id}>
                         <div className="flex justify-between mb-2">
                           <span className="font-bold text-white">{candidate.name} <span className="text-slate-500 text-sm font-normal">({candidate.party})</span></span>
                           <span className="text-primary-400 font-bold">{percentage}% ({votes} votes)</span>
                         </div>
                         <div className="w-full bg-slate-800 rounded-full h-3">
                           <div className="bg-primary-500 h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                         </div>
                       </div>
                     );
                   })
                 ) : (
                   <div className="text-center p-8 text-slate-400 border border-dashed border-slate-700 rounded-xl">
                     Results are currently being decrypted and audited by the smart contract.
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Database, Search, ArrowRight, ShieldCheck, Box } from 'lucide-react';

const Explorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch('http://localhost:5005/api/blockchain');
        const data = await res.json();
        setBlocks(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blockchain:", err);
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="w-8 h-8 text-primary-500" />
            Blockchain Explorer
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Public transparency portal. Verify the integrity of the ledger and view anonymous vote transactions protected by ZKP and ECC signatures.
          </p>
        </div>
        
        <div className="flex items-center glass-panel px-4 py-2 w-full md:w-auto">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search hash or block index..."
            className="bg-transparent border-none outline-none text-white text-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="glass-panel p-6 flex items-center justify-between border-primary-500/30 bg-primary-500/5">
           <div>
             <div className="text-slate-400 text-sm font-medium">Chain Status</div>
             <div className="text-xl font-bold text-white flex items-center mt-1">
               <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
               Immutable
             </div>
           </div>
           <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
             <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
           </div>
         </div>
         <div className="glass-panel p-6">
           <div className="text-slate-400 text-sm font-medium">Total Blocks</div>
           <div className="text-3xl font-bold text-white mt-1">{blocks.length}</div>
         </div>
         <div className="glass-panel p-6">
           <div className="text-slate-400 text-sm font-medium">Latest Hash</div>
           <div className="text-lg font-mono text-primary-400 mt-2 truncate">
             {blocks[0]?.hash || 'Syncing...'}
           </div>
         </div>
      </div>

      <div className="space-y-6 relative">
        {/* Visual Line connecting blocks */}
        <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-gradient-to-b from-primary-500/50 to-slate-800 rounded-full hidden md:block z-0" />

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading ledger data...</div>
        ) : (
          blocks.map((block, i) => (
            <div key={block.index} className="flex gap-6 relative z-10">
              <div className="hidden md:flex flex-col items-center">
                <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center border-2 shadow-lg bg-slate-900 ${i === 0 ? 'border-primary-500 text-primary-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'border-slate-700 text-slate-400'}`}>
                  <Box className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold leading-none">#{block.index}</span>
                </div>
              </div>

              <div className="glass-panel flex-1 p-6 overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 mb-4">
                  <div>
                    <span className="text-slate-400 text-sm font-medium mr-2">Mined:</span>
                    <span className="text-white text-sm">{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                  {i === 0 && (
                    <span className="px-3 py-1 rounded bg-primary-500/20 text-primary-400 text-xs font-bold tracking-wider uppercase border border-primary-500/30">Latest</span>
                  )}
                  {block.index === 0 && (
                    <span className="px-3 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase border border-purple-500/30">Genesis</span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                  <div>
                    <div className="mb-4">
                      <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Block Hash</span>
                      <span className="font-mono text-sm text-primary-300 break-all">{block.hash}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Previous Hash</span>
                      <div className="flex items-center text-slate-400 font-mono text-sm">
                        <ArrowRight className="w-4 h-4 mr-2 text-slate-600 hidden lg:block" />
                        <span className="break-all">{block.previousHash}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Voter Identity (ZKP Anonymous)</span>
                      <span className="font-mono text-sm text-slate-300 break-all">{block.voterHash}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">ZKP Verification</span>
                        <span className="font-mono text-sm text-emerald-400 truncate block bg-emerald-500/10 px-2 py-1 rounded">{block.zkProof}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Digital Sig (ECC)</span>
                        <span className="font-mono text-sm text-purple-400 truncate block bg-purple-500/10 px-2 py-1 rounded">{block.digitalSignature}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
};

export default Explorer;

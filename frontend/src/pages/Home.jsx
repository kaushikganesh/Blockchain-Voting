import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { ShieldCheck, ChevronRight, Fingerprint, Lock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="text-center z-10 max-w-3xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
        >
          <ShieldCheck className="w-12 h-12 text-primary-400" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Next-Gen <span className="text-gradient">Blockchain</span> Voting
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Experience the future of democracy. Immutable ledgers, zero-knowledge proofs, and post-quantum cryptography ensuring every vote counts securely.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center group w-full sm:w-auto justify-center">
            Register to Vote
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/explorer" className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition-all flex items-center w-full sm:w-auto justify-center">
            View Public Ledger
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl z-10">
        <FeatureCard 
          icon={<Fingerprint className="w-8 h-8 text-primary-400" />}
          title="Biometric MFA"
          desc="Advanced multifactor authentication simulating biometric hardware keys."
        />
        <FeatureCard 
          icon={<Lock className="w-8 h-8 text-accent-400" />}
          title="Zero-Knowledge"
          desc="Prove you have the right to vote without revealing your identity."
        />
        <FeatureCard 
          icon={<Shield className="w-8 h-8 text-purple-400" />}
          title="Quantum Proof"
          desc="Simulated CRYSTALS-Dilithium signatures to protect against future attacks."
        />
      </div>
    </PageWrapper>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-6"
  >
    <div className="mb-4 bg-slate-800/80 w-14 h-14 rounded-lg flex items-center justify-center border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </motion.div>
);

export default Home;

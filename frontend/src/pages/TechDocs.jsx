import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Lock, Fingerprint, Shield, Cpu, ExternalLink } from 'lucide-react';

const TechDocs = () => {
  const [activeLayer, setActiveLayer] = useState('zkp');

  const layers = {
    zkp: {
      title: 'Zero-Knowledge Proofs (ZKP)',
      icon: <Lock className="w-12 h-12 text-blue-400" />,
      color: 'blue',
      desc: 'Allows a voter to mathematically prove they have the right to vote without revealing their identity or how they voted.',
      details: [
        'Prover (Voter) generates a proof using their secret key and election public parameters.',
        'Verifier (Smart Contract) checks the proof without seeing the secret key.',
        'Ensures 100% voter privacy while maintaining 100% public verifiability.'
      ]
    },
    pqc: {
      title: 'Post-Quantum Cryptography',
      icon: <Cpu className="w-12 h-12 text-purple-400" />,
      color: 'purple',
      desc: 'Future-proofing the election integrity against quantum computer attacks using advanced lattice-based cryptography.',
      details: [
        'Traditional ECC and RSA signatures can be broken by Shor\'s algorithm on a quantum computer.',
        'We simulate NIST-approved CRYSTALS-Dilithium signature schemes.',
        'Ensures that votes cast today cannot be tampered with even decades in the future.'
      ]
    },
    ai: {
      title: 'AI Fraud Detection',
      icon: <Shield className="w-12 h-12 text-red-400" />,
      color: 'red',
      desc: 'Continuous monitoring of voting patterns using machine learning to detect coordinated attacks or bot behavior.',
      details: [
        'Analyzes metadata such as voting velocity, timestamp variance, and geographic clustering.',
        'Flags abnormal blocks for administrative review before final tally confirmation.',
        'Operates entirely off-chain to maintain blockchain performance.'
      ]
    },
    mfa: {
      title: 'Biometric MFA',
      icon: <Fingerprint className="w-12 h-12 text-emerald-400" />,
      color: 'emerald',
      desc: 'Hardware-backed biometric authentication ensuring the person casting the vote is the registered voter.',
      details: [
        'Uses FIDO2 / WebAuthn standards for passwordless authentication.',
        'Biometric data never leaves the user\'s device; only cryptographic attestations are sent to the server.',
        'Prevents phishing and credential stuffing attacks.'
      ]
    }
  };

  return (
    <PageWrapper>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Technology Stack</h1>
        <p className="text-slate-400 text-lg">
          Dive deep into the simulated cryptographic layers and security modules that power our decentralized voting prototype.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {Object.entries(layers).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setActiveLayer(key)}
              className={`w-full text-left p-4 rounded-xl flex items-center transition-all ${
                activeLayer === key 
                  ? `bg-${layer.color}-500/20 border border-${layer.color}-500/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]` 
                  : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
              }`}
            >
              <div className={`p-2 rounded-lg bg-${layer.color}-500/10 mr-4`}>
                {React.cloneElement(layer.icon, { className: `w-6 h-6 text-${layer.color}-400` })}
              </div>
              <span className={`font-semibold ${activeLayer === key ? 'text-white' : 'text-slate-300'}`}>
                {layer.title}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-8 h-full relative overflow-hidden">
            {/* Decorative Background Glow */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${layers[activeLayer].color}-500/10 rounded-full blur-[80px] transition-colors duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className={`p-4 rounded-2xl bg-${layers[activeLayer].color}-500/10 border border-${layers[activeLayer].color}-500/30 mr-6 inline-block`}>
                  {layers[activeLayer].icon}
                </div>
                <h2 className="text-3xl font-bold">{layers[activeLayer].title}</h2>
              </div>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {layers[activeLayer].desc}
              </p>

              <h3 className="text-lg font-semibold text-white mb-4">Implementation Details</h3>
              <ul className="space-y-4">
                {layers[activeLayer].details.map((detail, idx) => (
                  <li key={idx} className="flex flex-start p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-${layers[activeLayer].color}-500/20 text-${layers[activeLayer].color}-400 flex items-center justify-center text-xs font-bold mr-4 mt-0.5`}>
                      {idx + 1}
                    </span>
                    <span className="text-slate-400">{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 p-4 border border-slate-700 bg-slate-800/30 rounded-lg flex items-start">
                 <div className="text-slate-400 text-sm">
                   <strong>Prototype Note:</strong> In this application, these cryptographic primitives are simulated using standard Node.js crypto libraries (SHA-256 for ZKP mock, HMAC for signatures) to demonstrate the architecture in a conceptual university project format.
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default TechDocs;

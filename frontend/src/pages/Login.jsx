import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { Fingerprint, Smartphone, KeyRound, Loader2 } from 'lucide-react';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // MFA States
  const [mfaMethod, setMfaMethod] = useState('otp'); // otp or biometric
  const [otpCode, setOtpCode] = useState('');

  const handleInitialLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "https://blockchain-voting-backend-ff3v.onrender.com"}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, password })
      });
      const data = await res.json();
      setLoading(false);
      
      if (!res.ok) {
         setError(data.message || 'Login failed');
         return;
      }
      
      if (data.mfaRequired) {
        setStep(2);
      }
    } catch (err) {
      setLoading(false);
      setError('Network error connecting to backend.');
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/auth/verify-mfa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           voterId, 
           otpCode: mfaMethod === 'otp' ? otpCode : undefined,
           biometricHash: mfaMethod === 'biometric' ? 'simulated_biometric_hash_938102' : undefined
        })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
         setError(data.message || 'MFA Verification failed');
         return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setLoading(false);
      setError('Network error connecting to backend.');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[70vh]">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/20 rounded-full blur-[40px]" />
        
        <h2 className="text-3xl font-bold mb-2 text-center">Secure Login</h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          {step === 1 ? 'Authenticate to access the voting platform' : 'Complete 2-Factor Authentication'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleInitialLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Voter ID</label>
              <input 
                type="text" 
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g. VOTE-8921"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 rounded-lg transition-all flex justify-center items-center mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Verification'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaVerify} className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button 
                type="button"
                onClick={() => setMfaMethod('otp')}
                className={`flex-1 py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${mfaMethod === 'otp' ? 'bg-primary-600/20 border-primary-500 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-xs font-medium">Authenticator</span>
              </button>
              <button 
                type="button"
                onClick={() => setMfaMethod('biometric')}
                className={`flex-1 py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${mfaMethod === 'biometric' ? 'bg-primary-600/20 border-primary-500 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <Fingerprint className="w-6 h-6" />
                <span className="text-xs font-medium">Biometric</span>
              </button>
            </div>

            {mfaMethod === 'otp' ? (
              <div className="text-center">
                <label className="block text-sm font-medium text-slate-300 mb-2">Enter 6-digit OTP Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full max-w-[200px] mx-auto text-center tracking-[0.5em] text-2xl bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="------"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">Simulation: Use '123456'</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 bg-slate-900/30 rounded-lg border border-slate-800">
                <div className="relative">
                  <Fingerprint className={`w-16 h-16 ${loading ? 'text-primary-500 animate-pulse' : 'text-slate-400'}`} />
                  {loading && <div className="absolute inset-0 border-2 border-primary-500 rounded-lg animate-ping opacity-20" />}
                </div>
                <p className="text-sm text-slate-400 mt-4">Simulating biometric hardware check...</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 rounded-lg transition-all flex justify-center items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
            </button>
            
            <div className="text-center mt-4">
               <button 
                 type="button" 
                 onClick={() => setStep(1)} 
                 className="text-sm text-slate-400 hover:text-white"
               >
                 Cancel
               </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 ml-1">Register</Link>
          </p>
        )}
      </div>
    </PageWrapper>
  );
};

export default Login;

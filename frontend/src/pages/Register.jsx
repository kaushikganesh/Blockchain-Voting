import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    voterId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterId: formData.voterId,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError('Network error connecting to backend.');
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[70vh]">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-2 text-center">Voter Registration</h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          Register to participate in upcoming blockchain elections.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Voter ID (Govt. Issued)</label>
            <input 
              type="text" 
              name="voterId"
              value={formData.voterId}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. ID-99812A"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="voter@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-all flex justify-center items-center mt-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Registration'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already registered? <Link to="/login" className="text-primary-400 hover:text-primary-300 ml-1">Login</Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default Register;

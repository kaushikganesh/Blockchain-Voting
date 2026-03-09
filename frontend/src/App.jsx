import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Explorer from './pages/Explorer';
import TechDocs from './pages/TechDocs';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simple mock check for auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/admin" element={<AdminDashboard user={user} />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/tech" element={<TechDocs />} />
            </Routes>
          </AnimatePresence>
        </main>
        <footer className="py-6 text-center text-slate-400 border-t border-slate-800">
          <p>© 2026 Secure Blockchain Voting System. Quantum Ready.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

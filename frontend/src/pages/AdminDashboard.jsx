import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { ShieldAlert, PlusCircle, Activity, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated data
  const stats = {
    totalVoters: 1254,
    votesCast: 892,
    activeElections: 1,
    fraudAlerts: 2
  };

  const fraudLog = [
    { id: 1, type: 'Bot Activity', details: 'Extremely rapid consecutive votes detected.', risk: 'High', time: '10 mins ago' },
    { id: 2, type: 'Abnormal Location', details: 'Voting attempt from restricted geofence.', risk: 'Medium', time: '1 hour ago' }
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-slate-400">Manage elections and monitor system integrity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Voters" value={stats.totalVoters} icon={<Users className="w-6 h-6 text-blue-400" />} />
        <StatCard title="Votes Cast" value={stats.votesCast} icon={<Activity className="w-6 h-6 text-emerald-400" />} />
        <StatCard title="Active Elections" value={stats.activeElections} icon={<Settings className="w-6 h-6 text-purple-400" />} />
        <StatCard title="AI Fraud Alerts" value={stats.fraudAlerts} icon={<ShieldAlert className="w-6 h-6 text-red-400" />} alert />
      </div>

      <div className="flex border-b border-slate-800 mb-6">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
        <TabButton active={activeTab === 'elections'} onClick={() => setActiveTab('elections')}>Manage Elections</TabButton>
        <TabButton active={activeTab === 'fraud'} onClick={() => setActiveTab('fraud')}>AI Fraud Detection</TabButton>
      </div>

      <div className="glass-panel p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div>
             <h2 className="text-xl font-bold mb-4">System Status</h2>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                 <div>
                   <h3 className="font-medium text-white">Blockchain Status</h3>
                   <p className="text-sm text-slate-400">All nodes operational. Consensus active.</p>
                 </div>
                 <div className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/50 text-emerald-400">
                   Healthy
                 </div>
               </div>
               <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                 <div>
                   <h3 className="font-medium text-white">Smart Contracts</h3>
                   <p className="text-sm text-slate-400">Voting constraints enforcement active.</p>
                 </div>
                 <div className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/50 text-emerald-400">
                   Active
                 </div>
               </div>
               <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                 <div>
                   <h3 className="font-medium text-white">AI Fraud Module</h3>
                   <p className="text-sm text-slate-400">Anomaly detection neural network running.</p>
                 </div>
                 <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 border border-yellow-500/50 text-yellow-400">
                   Monitoring
                 </div>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'elections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Election Management</h2>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium flex items-center transition-all">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Election
              </button>
            </div>
            <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center">
              <p className="text-slate-400 mb-4">Simulation: In a full app, you would create elections and add candidates here.</p>
              <div className="inline-block p-4 bg-slate-800 rounded-lg text-left max-w-sm w-full">
                 <h4 className="font-medium text-white mb-2">Active: University Student Council 2026</h4>
                 <div className="flex justify-between text-sm text-slate-400 mb-1">
                   <span>Votes Collected:</span>
                   <span className="text-white">892</span>
                 </div>
                 <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fraud' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-red-400 flex items-center">
              <ShieldAlert className="w-6 h-6 mr-2" />
              AI Threat Intelligence
            </h2>
            <p className="text-slate-400 mb-6">Real-time anomaly detection identifying suspicious voting patterns.</p>
            
            <div className="space-y-4">
              {fraudLog.map(log => (
                <div key={log.id} className="p-4 border border-red-500/30 bg-red-500/5 rounded-lg flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border border-red-500/30">
                        {log.risk} RISK
                      </span>
                      <h4 className="font-bold text-white">{log.type}</h4>
                    </div>
                    <p className="text-sm text-slate-300">{log.details}</p>
                    <p className="text-xs text-slate-500 mt-2">{log.time}</p>
                  </div>
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-white">
                    Investigate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

const StatCard = ({ title, value, icon, alert }) => (
  <div className={`glass-panel p-6 ${alert ? 'border-red-500/30 bg-red-500/5' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="text-slate-400 text-sm font-medium">{title}</div>
      <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
    </div>
    <div className={`text-3xl font-bold ${alert ? 'text-red-400' : 'text-white'}`}>{value}</div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
      active 
        ? 'border-primary-500 text-primary-400' 
        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
    }`}
  >
    {children}
  </button>
);

export default AdminDashboard;

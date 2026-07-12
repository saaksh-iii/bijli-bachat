import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/logs/me')
      .then((res) => {
        setLogs(res.data.logs);
        setStreak(res.data.streak);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalKwh = logs.reduce((sum, l) => sum + l.kwhSaved, 0);
  const totalRupees = logs.reduce((sum, l) => sum + l.rupeesSaved, 0);
  const totalCo2 = logs.reduce((sum, l) => sum + l.co2Saved, 0);

  const badges = [
    { id: 'first', emoji: '🌱', label: 'Seedling', desc: 'First log', earned: logs.length >= 1 },
    { id: 'streak7', emoji: '🔥', label: '7-day streak', desc: '7 days in a row', earned: streak >= 7 },
    { id: 'power5', emoji: '⚡', label: 'Power Saver', desc: '5 kWh saved', earned: totalKwh >= 5 },
    { id: 'co2', emoji: '🌍', label: 'CO₂ Crusher', desc: '10 kg CO₂ avoided', earned: totalCo2 >= 10 },
    { id: 'logs30', emoji: '🏆', label: 'Bijli Hero', desc: '30 logs total', earned: logs.length >= 30 },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <div className="bg-green-700 px-4 py-5 text-white">
        <h1 className="text-lg font-bold">👤 Profile</h1>
        <p className="text-sm text-green-200">{user?.name}</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* User info */}
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.college}</p>
          <p className="text-sm text-gray-500">{user?.locality}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-3 shadow text-center">
            <p className="text-xl font-bold text-green-600">{totalKwh.toFixed(1)}</p>
            <p className="text-xs text-gray-500">kWh</p>
          </div>
          <div className="rounded-xl bg-white p-3 shadow text-center">
            <p className="text-xl font-bold text-green-600">₹{totalRupees.toFixed(0)}</p>
            <p className="text-xs text-gray-500">saved</p>
          </div>
          <div className="rounded-xl bg-white p-3 shadow text-center">
            <p className="text-xl font-bold text-green-600">🔥{streak}</p>
            <p className="text-xs text-gray-500">streak</p>
          </div>
        </div>

        {/* Badges */}
        <h2 className="font-semibold text-gray-700">Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl p-3 shadow text-center ${
                badge.earned ? 'bg-green-100 border border-green-400' : 'bg-white opacity-40'
              }`}
            >
              <p className="text-2xl">{badge.emoji}</p>
              <p className="text-xs font-semibold text-gray-700 mt-1">{badge.label}</p>
              <p className="text-xs text-gray-400">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent logs */}
        <h2 className="font-semibold text-gray-700">Recent activity</h2>
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-center">No logs yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 7).map((log) => (
              <div key={log._id} className="rounded-xl bg-white p-3 shadow flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{log.actionLabel}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-green-600">{log.kwhSaved} kWh</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-red-300 py-3 text-red-500 font-medium"
        >
          Logout
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 text-xs text-gray-500">
        <button onClick={() => navigate('/')} className="flex flex-col items-center">
          <span className="text-xl">🏠</span> Home
        </button>
        <button onClick={() => navigate('/leaderboard')} className="flex flex-col items-center">
          <span className="text-xl">🏆</span> Ranks
        </button>
        <button onClick={() => navigate('/impact')} className="flex flex-col items-center">
          <span className="text-xl">🌍</span> Impact
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-green-600">
          <span className="text-xl">👤</span> Profile
        </button>
      </div>
    </div>
  );
}
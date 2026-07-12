import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [actions, setActions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loggedToday, setLoggedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [actionsRes, logsRes] = await Promise.all([
          API.get('/logs/actions'),
          API.get('/logs/me'),
        ]);
        setActions(actionsRes.data);
        setLogs(logsRes.data.logs);
        setStreak(logsRes.data.streak);

        const today = new Date().toDateString();
        const todayLog = logsRes.data.logs.find(
          (l) => new Date(l.date).toDateString() === today
        );
        setLoggedToday(!!todayLog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleLog(actionId) {
    setPosting(true);
    setMessage('');
    try {
      await API.post('/logs', { actionId });
      setLoggedToday(true);
      setStreak((s) => s + 1);
      setMessage('✅ Logged! Great job saving energy today.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setPosting(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <p className="text-green-700 font-medium">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      {/* Header */}
      <div className="bg-green-700 px-4 py-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Bijli Bachat ⚡</h1>
            <p className="text-sm text-green-200">Hi, {user?.name?.split(' ')[0]}!</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-green-200 underline">
            Logout
          </button>
        </div>

        {/* Streak card */}
        <div className="mt-4 rounded-xl bg-green-600 p-4 text-center">
          <p className="text-4xl font-bold">🔥 {streak}</p>
          <p className="text-sm text-green-200 mt-1">day streak</p>
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Already logged today */}
        {loggedToday ? (
          <div className="rounded-xl bg-white p-5 shadow text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold text-gray-800">You've logged today!</p>
            <p className="text-sm text-gray-500 mt-1">Come back tomorrow to keep your streak.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-3 font-semibold text-gray-700">What did you do today?</h2>
            {message && (
              <p className="mb-3 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800">
                {message}
              </p>
            )}
            <div className="space-y-3">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleLog(action.id)}
                  disabled={posting}
                  className="w-full rounded-xl bg-white p-4 text-left shadow transition hover:shadow-md disabled:opacity-50"
                >
                  <p className="font-medium text-gray-800">{action.label}</p>
                  <p className="mt-1 text-sm text-green-600">
                    Saves {action.kwhSaved} kWh · ₹{(action.kwhSaved * 6.5).toFixed(2)} · {(action.kwhSaved * 0.82).toFixed(2)} kg CO₂
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 text-xs text-gray-500">
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-green-600">
          <span className="text-xl">🏠</span> Home
        </button>
        <button onClick={() => navigate('/leaderboard')} className="flex flex-col items-center">
          <span className="text-xl">🏆</span> Ranks
        </button>
        <button onClick={() => navigate('/impact')} className="flex flex-col items-center">
          <span className="text-xl">🌍</span> Impact
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center">
          <span className="text-xl">👤</span> Profile
        </button>
      </div>
    </div>
  );
}
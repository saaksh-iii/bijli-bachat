import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/leaderboard')
      .then((res) => setRankings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <div className="bg-green-700 px-4 py-5 text-white">
        <h1 className="text-lg font-bold">🏆 Leaderboard</h1>
        <p className="text-sm text-green-200">Top energy savers this month</p>
      </div>

      <div className="px-4 py-5">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : rankings.length === 0 ? (
          <p className="text-center text-gray-500">No data yet this month.</p>
        ) : (
          <div className="space-y-3">
            {rankings.map((entry, index) => (
              <div
                key={entry.userId}
                className={`rounded-xl p-4 shadow flex items-center gap-4 ${
                  entry.userId === user?.id ? 'bg-green-100 border border-green-400' : 'bg-white'
                }`}
              >
                <span className="text-2xl font-bold text-gray-400 w-8">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {entry.name} {entry.userId === user?.id && '(You)'}
                  </p>
                  <p className="text-xs text-gray-500">{entry.college}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{entry.totalKwh.toFixed(2)} kWh</p>
                  <p className="text-xs text-gray-500">₹{entry.totalRupees.toFixed(0)} saved</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 text-xs text-gray-500">
        <button onClick={() => navigate('/')} className="flex flex-col items-center">
          <span className="text-xl">🏠</span> Home
        </button>
        <button onClick={() => navigate('/leaderboard')} className="flex flex-col items-center text-green-600">
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
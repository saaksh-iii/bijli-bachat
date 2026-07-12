import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Impact() {
  const navigate = useNavigate();
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/leaderboard/map')
      .then((res) => setMapData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalKwh = mapData.reduce((sum, d) => sum + d.totalKwh, 0);
  const totalCo2 = mapData.reduce((sum, d) => sum + d.totalCo2, 0);
  const totalUsers = mapData.reduce((sum, d) => sum + d.userCount, 0);

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      <div className="bg-green-700 px-4 py-5 text-white">
        <h1 className="text-lg font-bold">🌍 Collective Impact</h1>
        <p className="text-sm text-green-200">What we've saved together</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-4 shadow text-center">
            <p className="text-2xl font-bold text-green-600">{totalKwh.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">kWh saved</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow text-center">
            <p className="text-2xl font-bold text-green-600">{totalCo2.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">kg CO₂ avoided</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow text-center">
            <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1">active users</p>
          </div>
        </div>

        {/* Equivalent impact */}
        <div className="rounded-xl bg-green-700 p-4 text-white">
          <p className="font-semibold mb-2">That's equivalent to...</p>
          <p className="text-sm text-green-200">
            🌳 {(totalCo2 / 21).toFixed(1)} trees absorbing CO₂ for a year
          </p>
          <p className="text-sm text-green-200 mt-1">
            📱 {Math.round(totalKwh * 100)} phone charges saved
          </p>
          <p className="text-sm text-green-200 mt-1">
            💰 ₹{(totalKwh * 6.5).toFixed(0)} saved collectively
          </p>
        </div>

        {/* By locality */}
        <h2 className="font-semibold text-gray-700">Impact by area</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : mapData.length === 0 ? (
          <p className="text-center text-gray-500">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {mapData
              .sort((a, b) => b.totalKwh - a.totalKwh)
              .map((area) => (
                <div key={area.locality} className="rounded-xl bg-white p-4 shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{area.locality}</p>
                      <p className="text-xs text-gray-500">{area.userCount} user{area.userCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{area.totalKwh.toFixed(2)} kWh</p>
                      <p className="text-xs text-gray-500">{area.totalCo2.toFixed(2)} kg CO₂</p>
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-green-500"
                      style={{ width: `${Math.min((area.totalKwh / totalKwh) * 100, 100)}%` }}
                    />
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
        <button onClick={() => navigate('/leaderboard')} className="flex flex-col items-center">
          <span className="text-xl">🏆</span> Ranks
        </button>
        <button onClick={() => navigate('/impact')} className="flex flex-col items-center text-green-600">
          <span className="text-xl">🌍</span> Impact
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center">
          <span className="text-xl">👤</span> Profile
        </button>
      </div>
    </div>
  );
}
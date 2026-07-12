import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LOCALITIES = [
  'Adarsh Nagar', 'Ajmer Road', 'Amer', 'Bani Park', 'C-Scheme',
  'Civil Lines', 'Durgapura', 'Gopalpura', 'Jagatpura', 'Jhotwara',
  'JLN Marg', 'Malviya Nagar', 'Mansarovar', 'MI Road', 'Nirman Nagar',
  'Pratap Nagar', 'Raja Park', 'Sanganer', 'Shastri Nagar', 'Sirsi Road',
  'Sitapura', 'Sodala', 'Tonk Road', 'Vaishali Nagar', 'Vidhyadhar Nagar',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', roomNo: '', college: '', locality: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-600 to-green-800 px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Bijli Bachat ⚡</h1>
          <p className="mt-1 text-sm text-gray-500">Save energy. Earn streaks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', name: 'name', type: 'text', placeholder: 'Saakshi Singh' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Room No', name: 'roomNo', type: 'text', placeholder: '101' },
            { label: 'College', name: 'college', type: 'text', placeholder: 'Alankar PG Girls College' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Locality</label>
            <select
              name="locality"
              value={form.locality}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select your locality</option>
              {LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
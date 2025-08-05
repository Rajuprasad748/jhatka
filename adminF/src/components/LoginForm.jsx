import React, { useState } from 'react';
import axios from 'axios';

const AdminLoginForm = () => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { password });
      alert(res.data.message || 'Login success');
      // handle token or login session if needed
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto bg-gray-700 text-white p-5 rounded-2xl border border-gray-800 space-y-5 sm:max-w-md">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-center">Admin Login</h1>

        <label className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="peer w-full p-4 pt-6 bg-[#333] text-white border border-gray-600 rounded-lg outline-none"
          />
          <span className="absolute left-2 top-2 text-sm text-white/60 peer-focus:text-sky-400">
            Enter Admin Password
          </span>
        </label>

        <button type="submit" className="bg-sky-400 hover:bg-sky-300 text-white py-2 rounded-lg transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;

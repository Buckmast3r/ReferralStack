import React, { useState } from 'react';

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Logging in...', { email, password });
    } else {
      console.log('Registering...', { email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md space-y-4 w-full max-w-sm">
      <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full p-2 border rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
        {mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
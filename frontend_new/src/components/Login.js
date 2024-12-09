import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { useCookies } from 'react-cookie';
import api from '../services/api';

function Login({ onLogin, onSignupClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['id', 'password']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login({email: email, password: password})
      setCookie("id", response.data[0].UserID)
      setCookie("password", password)
      navigate('/exercises');
    } catch (err) {
      setError('Invalid User ID or password');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-screen">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
            </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
            )}
            <div>
            <label htmlFor="Email" className="sr-only">
                Email
            </label>
            <input
                id="Email"
                name="Email"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="password" className="sr-only">
                Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div>
            <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Sign in
            </button>
            </div>

            <div className="text-sm text-center">
            <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
            >
                Don't have an account? Sign up
            </button>
            </div>
        </form>
        </div>
    </div>
  );
}

export default Login;
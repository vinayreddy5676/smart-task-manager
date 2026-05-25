import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await login(email, password);
            loginUser(response.data.token, email);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Left Side */}
            <div className="hidden lg:flex w-1/2 bg-violet-700 flex-col items-center justify-center p-12">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-violet-700 font-bold text-2xl">ST</span>
                </div>
                <h1 className="text-white text-4xl font-bold mb-4">SmartTasks</h1>
                <p className="text-violet-200 text-center text-lg">
                    AI-powered task management. Let Gemini AI decide your task priorities automatically.
                </p>
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-violet-600 rounded-xl p-4">
                        <p className="text-white font-bold text-2xl">AI</p>
                        <p className="text-violet-200 text-sm">Priority Detection</p>
                    </div>
                    <div className="bg-violet-600 rounded-xl p-4">
                        <p className="text-white font-bold text-2xl">JWT</p>
                        <p className="text-violet-200 text-sm">Secure Auth</p>
                    </div>
                    <div className="bg-violet-600 rounded-xl p-4">
                        <p className="text-white font-bold text-2xl">REST</p>
                        <p className="text-violet-200 text-sm">Spring Boot API</p>
                    </div>
                    <div className="bg-violet-600 rounded-xl p-4">
                        <p className="text-white font-bold text-2xl">SQL</p>
                        <p className="text-violet-200 text-sm">MySQL Database</p>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-white text-3xl font-bold mb-2">Welcome back!</h2>
                    <p className="text-slate-400 mb-8">Sign in to your account</p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-slate-300 text-sm font-medium block mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-slate-300 text-sm font-medium block mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-slate-400 text-center mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
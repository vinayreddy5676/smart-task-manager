import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
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
                    Join thousands of students managing tasks smarter with AI.
                </p>
                <div className="mt-12 space-y-4 w-full max-w-sm">
                    <div className="bg-violet-600 rounded-xl p-4 flex items-center gap-4">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <p className="text-white font-semibold">AI Priority Detection</p>
                            <p className="text-violet-200 text-sm">Gemini AI classifies your tasks automatically</p>
                        </div>
                    </div>
                    <div className="bg-violet-600 rounded-xl p-4 flex items-center gap-4">
                        <span className="text-2xl">🔒</span>
                        <div>
                            <p className="text-white font-semibold">Secure & Private</p>
                            <p className="text-violet-200 text-sm">JWT authentication keeps your data safe</p>
                        </div>
                    </div>
                    <div className="bg-violet-600 rounded-xl p-4 flex items-center gap-4">
                        <span className="text-2xl">📊</span>
                        <div>
                            <p className="text-white font-semibold">Smart Dashboard</p>
                            <p className="text-violet-200 text-sm">Visual charts and stats for your tasks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h2 className="text-white text-3xl font-bold mb-2">Create account</h2>
                    <p className="text-slate-400 mb-8">Start managing tasks smarter today</p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="text-slate-300 text-sm font-medium block mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Vinay Reddy"
                                required
                                className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                            />
                        </div>
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
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-slate-400 text-center mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
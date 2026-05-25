import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { userEmail, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ST</span>
                </div>
                <span className="text-white font-bold text-xl">
                    Smart<span className="text-violet-400">Tasks</span>
                </span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
                <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-violet-400 transition font-medium"
                >
                    Dashboard
                </Link>
                <Link
                    to="/tasks"
                    className="text-slate-300 hover:text-violet-400 transition font-medium"
                >
                    Tasks
                </Link>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">{userEmail}</span>
                <button
                    onClick={handleLogout}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
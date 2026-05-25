import { useEffect, useState } from 'react';
import { getTasks } from '../services/api';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                setTasks(response.data);
            } catch (err) {
                console.error('Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Stats
    const total = tasks.length;
    const high = tasks.filter(t => t.priority === 'HIGH').length;
    const medium = tasks.filter(t => t.priority === 'MEDIUM').length;
    const low = tasks.filter(t => t.priority === 'LOW').length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;

    // Chart data
    const priorityData = [
        { name: 'HIGH', value: high },
        { name: 'MEDIUM', value: medium },
        { name: 'LOW', value: low },
    ];

    const statusData = [
        { name: 'Pending', value: pending },
        { name: 'Completed', value: completed },
    ];

    const PRIORITY_COLORS = ['#EF4444', '#F59E0B', '#22C55E'];
    const STATUS_COLORS = ['#7C3AED', '#22C55E'];

    const recentTasks = [...tasks].reverse().slice(0, 5);

    return (
        <div className="min-h-screen bg-[#0F172A]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-white text-3xl font-bold">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Overview of all your tasks</p>
                </div>

                {loading ? (
                    <div className="text-center text-slate-400 py-20">Loading...</div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                                <p className="text-slate-400 text-sm">Total Tasks</p>
                                <p className="text-white text-3xl font-bold mt-1">{total}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-5 border border-red-500/30">
                                <p className="text-red-400 text-sm">HIGH</p>
                                <p className="text-red-400 text-3xl font-bold mt-1">{high}</p>
                            </div>
                            <div className="bg-amber-500/10 rounded-xl p-5 border border-amber-500/30">
                                <p className="text-amber-400 text-sm">MEDIUM</p>
                                <p className="text-amber-400 text-3xl font-bold mt-1">{medium}</p>
                            </div>
                            <div className="bg-green-500/10 rounded-xl p-5 border border-green-500/30">
                                <p className="text-green-400 text-sm">LOW</p>
                                <p className="text-green-400 text-3xl font-bold mt-1">{low}</p>
                            </div>
                            <div className="bg-violet-500/10 rounded-xl p-5 border border-violet-500/30">
                                <p className="text-violet-400 text-sm">Completed</p>
                                <p className="text-violet-400 text-3xl font-bold mt-1">{completed}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Pie Chart */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <h2 className="text-white font-semibold text-lg mb-4">Priority Distribution</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={priorityData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {priorityData.map((_, index) => (
                                                <Cell key={index} fill={PRIORITY_COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: 'white' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <h2 className="text-white font-semibold text-lg mb-4">Task Status</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={statusData}>
                                        <XAxis dataKey="name" stroke="#94A3B8" />
                                        <YAxis stroke="#94A3B8" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: 'white' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                            {statusData.map((_, index) => (
                                                <Cell key={index} fill={STATUS_COLORS[index]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Tasks */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-white font-semibold text-lg mb-4">Recent Tasks</h2>
                            {recentTasks.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No tasks yet. Go add some!</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentTasks.map(task => (
                                        <div key={task.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-4 py-3">
                                            <div>
                                                <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                                    {task.title}
                                                </p>
                                                <p className="text-slate-400 text-sm">{task.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                    task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                                    task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-green-500/20 text-green-400'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`text-xs px-3 py-1 rounded-full ${
                                                    task.completed ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-700 text-slate-300'
                                                }`}>
                                                    {task.completed ? 'COMPLETED' : task.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
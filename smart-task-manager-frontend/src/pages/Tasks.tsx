import { useEffect, useState } from 'react';
import {
    getTasks, addTask, deleteTask,
    completeTask, getTasksByPriority,
    getTasksByStatus, searchTasks
} from '../services/api';

import Navbar from '../components/Navbar';

const Tasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Add Task Form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('PENDING');
    const [dueDate, setDueDate] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getTasks();
            setTasks(response.data);
        } catch (err) {
            setError('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            await addTask({
                title,
                description,
                status,
                priority: '',
                dueDate: dueDate ? dueDate + ':00' : null,
            });
            setTitle('');
            setDescription('');
            setStatus('PENDING');
            setDueDate('');
            fetchTasks();
        } catch (err) {
            setError('Failed to add task.');
        } finally {
            setAddLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (err) {
            setError('Failed to delete task.');
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await completeTask(id);
            fetchTasks();
        } catch (err) {
            setError('Failed to complete task.');
        }
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            fetchTasks();
            return;
        }
        try {
            const response = await searchTasks(search);
            setTasks(response.data);
        } catch (err) {
            setError('Search failed.');
        }
    };

    const handlePriorityFilter = async (priority: string) => {
        setPriorityFilter(priority);
        setStatusFilter('ALL');
        try {
            if (priority === 'ALL') {
                fetchTasks();
            } else {
                const response = await getTasksByPriority(priority);
                setTasks(response.data);
            }
        } catch (err) {
            setError('Filter failed.');
        }
    };

    const handleStatusFilter = async (status: string) => {
        setStatusFilter(status);
        setPriorityFilter('ALL');
        try {
            if (status === 'ALL') {
                fetchTasks();
            } else {
                const response = await getTasksByStatus(status);
                setTasks(response.data);
            }
        } catch (err) {
            setError('Filter failed.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-white text-3xl font-bold">Task Manager</h1>
                    <p className="text-slate-400 mt-1">Add, manage and track all your tasks</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Add Task Form */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
                    <h2 className="text-white font-semibold text-lg mb-4">
                        ➕ Add New Task
                        <span className="text-violet-400 text-sm font-normal ml-2">
                            (AI will auto-detect priority)
                        </span>
                    </h2>
                    <form onSubmit={handleAddTask}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-slate-300 text-sm font-medium block mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Submit Assignment"
                                    required
                                    className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                                />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium block mb-2">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Due in 1 hour, must submit now"
                                    required
                                    className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                                />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium block mb-2">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium block mb-2">Due Date (optional)</label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-violet-500 transition"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={addLoading}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {addLoading ? '🤖 AI is thinking...' : 'Add Task'}
                        </button>
                    </form>
                </div>

                {/* Filters */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Search */}
                        <div className="flex gap-2 flex-1 min-w-[200px]">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tasks..."
                                className="flex-1 bg-slate-900 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-violet-500 transition"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Search
                            </button>
                            <button
                                onClick={() => { setSearch(''); fetchTasks(); }}
                                className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Priority Filter */}
                        <div className="flex gap-2">
                            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => handlePriorityFilter(p)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        priorityFilter === p
                                            ? p === 'HIGH' ? 'bg-red-500 text-white'
                                            : p === 'MEDIUM' ? 'bg-amber-500 text-white'
                                            : p === 'LOW' ? 'bg-green-500 text-white'
                                            : 'bg-violet-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            {['ALL', 'PENDING', 'COMPLETED'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusFilter(s)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        statusFilter === s
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <h2 className="text-white font-semibold">
                            All Tasks
                            <span className="text-slate-400 text-sm font-normal ml-2">
                                ({tasks.length} total)
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center text-slate-400 py-20">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center text-slate-400 py-20">
                            No tasks found. Add your first task above!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-900">
                                    <tr>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">ID</th>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">Title</th>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">Description</th>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">Priority</th>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">Status</th>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">Due Date</th>
                                        <th className="text-left text-slate-400 text-sm px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => (
                                        <tr
                                            key={task.id}
                                            className={`border-t border-slate-700 hover:bg-slate-700/50 transition ${
                                                index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'
                                            }`}
                                        >
                                            <td className="text-slate-400 text-sm px-4 py-3">#{task.id}</td>
                                            <td className={`px-4 py-3 font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                                {task.title}
                                            </td>
                                            <td className="text-slate-400 text-sm px-4 py-3 max-w-[200px] truncate">
                                                {task.description}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                    task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                                    task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-green-500/20 text-green-400'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-3 py-1 rounded-full ${
                                                    task.completed ? 'bg-violet-500/20 text-violet-400' :
                                                    task.status === 'PENDING' ? 'bg-slate-700 text-slate-300' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {task.completed ? 'COMPLETED' : task.status}
                                                </span>
                                            </td>
                                            <td className="text-slate-400 text-sm px-4 py-3">
                                                {task.dueDate
                                                    ? new Date(task.dueDate).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {!task.completed && (
                                                        <button
                                                            onClick={() => handleComplete(task.id)}
                                                            className="bg-green-500/20 hover:bg-green-500/40 text-green-400 px-3 py-1 rounded-lg text-xs transition"
                                                        >
                                                            ✅ Done
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1 rounded-lg text-xs transition"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
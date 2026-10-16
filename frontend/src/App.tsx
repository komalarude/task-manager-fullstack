import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from './api';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import { Status, Task, TaskInput } from './types';

type Filter = 'all' | Status;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load all tasks once when the page opens
  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (input: TaskInput) => {
    try {
      const created = await createTask(input);
      setTasks((prev) => [created, ...prev]);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleStatusChange = async (task: Task, status: Status) => {
    try {
      const { id, ...rest } = task;
      const updated = await updateTask(id, { ...rest, status });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-center">Task Manager</h1>

        <TaskForm onAdd={handleAdd} />

        {error && <p className="bg-red-100 text-red-700 p-3 rounded">{error}</p>}

        <div className="flex gap-2 justify-center text-sm">
          {(['all', 'todo', 'in_progress', 'done'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${filter === f ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              {f === 'all' ? 'All' : f === 'todo' ? 'To do' : f === 'in_progress' ? 'In progress' : 'Done'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {visible.map((task) => (
              <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

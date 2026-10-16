import { useState, FormEvent } from 'react';
import { Priority, TaskInput } from '../types';

interface Props {
  onAdd: (task: TaskInput) => Promise<void>;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError('Please enter a title.');
      return;
    }
    setError('');
    await onAdd({
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      due_date: dueDate || null,
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="text-lg font-semibold">Add a new task</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
        rows={2}
      />
      <div className="flex flex-wrap gap-3">
        <select
          className="border rounded px-3 py-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Task
        </button>
      </div>
    </form>
  );
}

import { Status, Task } from '../types';

interface Props {
  task: Task;
  onStatusChange: (task: Task, status: Status) => void;
  onDelete: (id: number) => void;
}

const priorityStyle = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskItem({ task, onStatusChange, onDelete }: Props) {
  return (
    <li className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded ${priorityStyle[task.priority]}`}>{task.priority}</span>
          {task.due_date && <span className="text-gray-500">Due: {task.due_date}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as Status)}
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={() => onDelete(task.id)} className="text-red-600 text-sm hover:underline">
          Delete
        </button>
      </div>
    </li>
  );
}

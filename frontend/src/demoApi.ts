import { Task, TaskInput } from './types';

// Demo mode: stores tasks in the browser (localStorage) so the app works on a static host
// without the Express + MySQL backend. The full version uses the REST API in /backend.
const KEY = 'task-manager-demo';

const SEED: Task[] = [
  { id: 2, title: 'Design database', description: 'Create tables and relations in MySQL', status: 'done', priority: 'medium', due_date: null },
  { id: 1, title: 'Learn Express basics', description: 'Build a simple REST API', status: 'in_progress', priority: 'high', due_date: null },
];

function load(): Task[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch {
    // ignore and fall back to the seed data
  }
  return [...SEED];
}

function save(tasks: Task[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // storage may be unavailable; the app still works for the current session
  }
}

export async function getTasks(): Promise<Task[]> {
  return load();
}

export async function createTask(input: TaskInput): Promise<Task> {
  const tasks = load();
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task: Task = { id: nextId, ...input };
  save([task, ...tasks]);
  return task;
}

export async function updateTask(id: number, input: TaskInput): Promise<Task> {
  const tasks = load();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Task not found.');
  const updated: Task = { id, ...input };
  tasks[index] = updated;
  save(tasks);
  return updated;
}

export async function deleteTask(id: number): Promise<void> {
  save(load().filter((t) => t.id !== id));
}

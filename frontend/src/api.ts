import { Task, TaskInput } from './types';

const BASE = '/api/tasks';

// Reads the response, and throws a readable error if the request failed
async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.error || (body.errors && body.errors.join(' ')) || 'Request failed';
    throw new Error(message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function getTasks(): Promise<Task[]> {
  return handle<Task[]>(await fetch(BASE));
}

export async function createTask(input: TaskInput): Promise<Task> {
  return handle<Task>(
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  );
}

export async function updateTask(id: number, input: TaskInput): Promise<Task> {
  return handle<Task>(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  );
}

export async function deleteTask(id: number): Promise<void> {
  return handle<void>(await fetch(`${BASE}/${id}`, { method: 'DELETE' }));
}

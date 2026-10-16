export const STATUSES = ['todo', 'in_progress', 'done'] as const;
export const PRIORITIES = ['low', 'medium', 'high'] as const;

export interface TaskInput {
  title: string;
  description: string;
  status: (typeof STATUSES)[number];
  priority: (typeof PRIORITIES)[number];
  due_date: string | null;
}

// Validates the request body. Returns the clean data, or a list of error messages.
export function validateTask(body: any): { data?: TaskInput; errors: string[] } {
  const errors: string[] = [];

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const status = body?.status ?? 'todo';
  const priority = body?.priority ?? 'medium';
  const dueDate = body?.due_date ? String(body.due_date) : null;

  if (title.length < 1 || title.length > 120) errors.push('Title is required (max 120 characters).');
  if (description.length > 500) errors.push('Description can be at most 500 characters.');
  if (!STATUSES.includes(status)) errors.push('Status must be todo, in_progress or done.');
  if (!PRIORITIES.includes(priority)) errors.push('Priority must be low, medium or high.');
  if (dueDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) errors.push('Due date must be in YYYY-MM-DD format.');

  if (errors.length > 0) return { errors };
  return { data: { title, description, status, priority, due_date: dueDate }, errors };
}

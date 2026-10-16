import { Router, Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import { validateTask, STATUSES } from '../validate';

const router = Router();

// GET /api/tasks?status=todo  -> list all tasks (optionally filtered by status)
router.get('/', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    if (status !== undefined && !STATUSES.includes(status as any)) {
      return res.status(400).json({ error: 'Invalid status filter.' });
    }
    const [rows] = status
      ? await pool.query<RowDataPacket[]>('SELECT * FROM tasks WHERE status = ? ORDER BY id DESC', [status])
      : await pool.query<RowDataPacket[]>('SELECT * FROM tasks ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// GET /api/tasks/:id  -> get one task
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch the task.' });
  }
});

// POST /api/tasks  -> create a task
router.post('/', async (req: Request, res: Response) => {
  const { data, errors } = validateTask(req.body);
  if (!data) return res.status(400).json({ errors });
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [data.title, data.description, data.status, data.priority, data.due_date]
    );
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create the task.' });
  }
});

// PUT /api/tasks/:id  -> update a task
router.put('/:id', async (req: Request, res: Response) => {
  const { data, errors } = validateTask(req.body);
  if (!data) return res.status(400).json({ errors });
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
      [data.title, data.description, data.status, data.priority, data.due_date, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found.' });
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update the task.' });
  }
});

// DELETE /api/tasks/:id  -> delete a task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found.' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete the task.' });
  }
});

export default router;

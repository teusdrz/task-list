import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/index.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Allow server to read JSON bodies

const PORT = 3001; // Port for our backend server

// GET all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  
  // Mapeia a propriedade 'isDone' do backend para 'done' do frontend
  const transformedTasks = tasks.map(task => ({
    ...task,
    done: task.isDone,
  }));

  res.json(transformedTasks);
});

// POST a new task
app.post('/tasks', async (req, res) => {
  const { title, priority } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title, priority, isDone: false },
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT (update) a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, done, priority } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(done !== undefined && { isDone: done }),
        ...(priority !== undefined && { priority }),
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(404).json({ error: 'Task not found or update failed' });
  }
});

// PATCH (update partial) a task
app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, done, priority } = req.body;
  
  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(done !== undefined && { isDone: done }),
        ...(priority !== undefined && { priority }),
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(404).json({ error: 'Task not found or update failed' });
  }
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(404).send({ error: 'Task not found' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

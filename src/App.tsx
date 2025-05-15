import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task, Priority } from './types/task';

type SortBy = 'priority' | 'dueDate';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');

  // Load tasks from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded from storage:', parsed);
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setTasks(prev => [
      ...prev,
      {
        ...task,
        id: Date.now().toString(),
        completed: false,
      },
    ]);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    // Priority: High > Medium > Low
    const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  console.log('Tasks state before render:', tasks);
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper elevation={3} 
      sx={{
        p: { xs: 1, sm: 3 },
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'auto',
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          ToDo App
        </Typography>
        <TaskForm onSubmit={handleAddTask} />
        <Box mt={2} mb={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center">
            <Typography>Sort by:</Typography>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(_, value) => value && setSortBy(value)}
              size="small"
            >
              <ToggleButton value="dueDate">Due Date</ToggleButton>
              <ToggleButton value="priority">Priority</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
        <Box mt={2}>
          <TaskList tasks={sortedTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
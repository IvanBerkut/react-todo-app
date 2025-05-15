import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Stack } from '@mui/material';
import { Task, Priority } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  initial?: Omit<Task, 'id' | 'completed'>;
  isEdit?: boolean;
}

const priorities: Priority[] = ['Low', 'Medium', 'High'];

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initial, isEdit }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [priority, setPriority] = useState<Priority>(initial?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate || '');
  const [description, setDescription] = useState(initial?.description || '');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setPriority(initial.priority || 'Medium');
      setDueDate(initial.dueDate || '');
      setDescription(initial.description || '');
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, priority, dueDate: dueDate || undefined, description });
    if (!isEdit) {
      setTitle('');
      setPriority('Medium');
      setDueDate('');
      setDescription('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={2} sx={{ pt: 2 }}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          minRows={2}
        />
        <TextField
          fullWidth
          select
          label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          {priorities.map(p => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <Button fullWidth type="submit" variant="contained">
          {isEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskForm;
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/task';
import TaskForm from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  return (
    <>
      {tasks.length === 0 ? (
        <Typography align="center">No tasks yet.</Typography>
      ) : (
        <List>
          {tasks.map(task => (
            <ListItem
              key={task.id}
              divider
              alignItems="flex-start"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <ListItemText
                sx={{ pr: { xs: 0, sm: 8 }, flex: 1 }}
                primaryTypographyProps={{ sx: { wordBreak: 'break-word', whiteSpace: 'pre-line' } }}
                primary={
                  <>
                    {task.title} ({task.priority})
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {task.description}
                      </Typography>
                    )}
                  </>
                }
                secondary={task.dueDate ? `Due: ${task.dueDate}` : undefined}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: { xs: 1, sm: 0 },
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                }}
              >
                <IconButton size="small" edge="end" aria-label="edit" onClick={() => setEditingTask(task)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" edge="end" aria-label="delete" onClick={() => setTaskToDelete(task)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </ListItem>
          ))}
        </List>
      )}

      {/* Edit Dialog */}
        <Dialog
            open={!!editingTask}
            onClose={() => setEditingTask(null)}
            fullWidth
            maxWidth="sm" // or "md" for even wider
            >
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {editingTask && (
                <TaskForm
                    onSubmit={updated => {
                    onEdit({ ...editingTask, ...updated });
                    setEditingTask(null);
                    }}
                    initial={editingTask}
                    isEdit
                />
                )}
            </DialogContent>
        </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!taskToDelete} onClose={() => setTaskToDelete(null)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{taskToDelete?.title}"?
          </Typography>
          <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
            <Button
              onClick={() => setTaskToDelete(null)}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (taskToDelete) onDelete(taskToDelete.id);
                setTaskToDelete(null);
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskList;
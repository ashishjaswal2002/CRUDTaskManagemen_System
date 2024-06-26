'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";




export function ManagementUi() {



  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  

  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');


  useEffect(() => {
  
    if (typeof window !== 'undefined') {
      fetch('/api/tasks')
       .then(response => response.json())
       .then(data => setTasks(data));
    }
  },[]);


  const handleAddTask = async (e) => {
    e.preventDefault(); 


    try {
      let response;
      if (editTask) {
        // Update existing task
        response = await fetch(`/api/tasks/${editTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            dueDate: editDueDate,
          }),
        });
      } else {
        // Add new task
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, dueDate }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to add or update task');
      }

      const updatedTask = await response.json();
      console.log('Task updated successfully:', updatedTask);

      // Update tasks state to reflect the change
      if (editTask) {
        setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
        setEditTask(null); // Clear edit mode
      } else {
        setTasks(prevTasks => [...prevTasks, updatedTask]);
      }

      // Clear form fields and close modal
      setTitle('');
      setDescription('');
      setDueDate('');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding or updating task:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Update tasks state to reflect the deletion
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);

    }
  };
  // Function to handle editing a task
  const handleEditTask = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate);
    setShowModal(true); // Open modal for editing
  };


  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-900 text-slate-50 py-4 px-6 shadow dark:bg-slate-50 dark:text-slate-900">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Button
            variant="secondary"
            className="rounded-md px-4 py-2 text-sm font-medium"
            onClick={() => {
              setEditTask(null); // Clear edit mode
              setTitle('');
              setDescription('');
              setDueDate('');
              setShowModal(true);
            }}
          >
            Add Task
          </Button>
        </div>
      </header>

      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <p className="text-lg font-medium">{editTask ? 'Edit task' : 'Add a new task'}</p>
              <form className="grid w-full gap-4" onSubmit={handleAddTask}>
                <Input placeholder="Task title"  value={editTask ? editTitle : title} onChange={editTask ? (e) => setEditTitle(e.target.value) : (e) => setTitle(e.target.value)} />
               
                <Input placeholder="Task description"value={editTask ? editDescription : description} onChange={editTask ? (e) => setEditDescription(e.target.value) : (e) => setDescription(e.target.value)} />
              
                <Input type="date" value={editTask ? editDueDate : dueDate} onChange={editTask ? (e) => setEditDueDate(e.target.value) : (e) => setDueDate(e.target.value)} />
              
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editTask ? 'Save Changes' : 'Add'}</Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <main className="flex-1 bg-white py-8 px-6 dark:bg-slate-950">
        <div className="container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tasks.map(task => (
            <Card key={task.id} className="bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50">
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">{task.dueDate}</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                      onClick={() => handleEditTask(task)}
                    >
                      <FilePenIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-50 py-4 px-6 shadow dark:bg-slate-50 dark:text-slate-900">
        <div className="container mx-auto text-center text-sm">&copy; Made by Ashish Jaswal</div>
      </footer>
    </div>
  );
}




function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

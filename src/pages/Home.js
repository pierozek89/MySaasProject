import React, { useEffect, useState } from 'react';
import API from '../api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

// Main page for viewing and creating tasks
function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Called after a new task is created to refresh the list
  const handleTaskCreated = () => {
    fetchTasks();
  };

  return (
    <div>
      <h1>Production Floor Task Management</h1>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default Home;

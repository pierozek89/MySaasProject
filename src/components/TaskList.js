import React from 'react';

// Simple task list display; parent handles fetching tasks
function TaskList({ tasks }) {
  return (
    <div>
      <h3>Task List</h3>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.name}</strong> | Status: {task.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;

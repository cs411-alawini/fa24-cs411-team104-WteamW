import React, { useState, useEffect } from 'react';
import api from '../services/api';
const Leaderboard = () => {
  const [users, setUsers] = useState([{}]);

  useEffect(() => {
    api.findMostActiveUsers().then(
      (value) => {
        console.log(value.data[0])
        setUsers(value.data[0])
      }
    )
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ul className="bg-white shadow overflow-hidden sm:rounded-md">
        {users.map((user,idx) => (
          <li key={idx} className="border-t border-gray-200">
            <div className="py-4 px-4 flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">{idx}. {user.UserName}</h2>
                <p className="text-gray-500">Exercises Completed: {user.exercises_completed}</p>
                <p className="text-gray-500">Notes Taken: {user.NotesCount}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 ml-1">Average Score: </span>
                <span className="text-xl font-bold">{user.avg_score}</span>
                
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
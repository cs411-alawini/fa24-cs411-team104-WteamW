import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExerciseList from './components/ExerciseList';
import Stars from './components/Stars';
import ExploreHistory from './components/ExploreHistory';
import Leaderboard from './components/Leaderboard'; 
import Concepts from './components/Concepts';
import Login from './components/Login';
import Signup from './components/Signup'; 

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup/>} />
            <Route path="/exercises" element={<ExerciseList />} />
            <Route path="/stars" element={<Stars />} />
            <Route path="/explore-history" element={<ExploreHistory />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/concepts" element={<Concepts />} /> 
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
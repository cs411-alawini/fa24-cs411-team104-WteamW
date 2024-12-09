import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import api from '../services/api';

function Stars() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadStarredExercises = async () => {
    try {
      setLoading(true);
      const response = await api.getStarredExercises({ page: currentPage });
      setExercises(response.data);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error loading starred exercises:', err);
      setError('Failed to load starred exercises');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstar = async (exerciseId) => {
    try {
      await api.unstarExercise(exerciseId);
      await loadStarredExercises();
    } catch (err) {
      console.error('Error unstarring exercise:', err);
    }
  };

  useEffect(() => {
    loadStarredExercises();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Starred Exercises</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map(exercise => (
          <ExerciseCard 
            key={exercise.ExerciseID}
            exercise={exercise}
            onUnstar={handleUnstar}
            isStarred={true}
          />
        ))}
        {exercises.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No starred exercises yet
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded ${
                currentPage === i + 1 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stars;
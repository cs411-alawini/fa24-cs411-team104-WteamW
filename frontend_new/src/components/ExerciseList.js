// frontend/src/components/ExerciseList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SearchBar from './SearchBar';
import ExerciseCard from './ExerciseCard';

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    category: null,
    difficulty: null,
    keyword: '',
    page: 1,
    limit: 9 
  });

  useEffect(() => {
    setLoading(true);
    try {
      api.searchExercises(
        searchParams
      ).then((value) => {
        setExercises(value.data)
        setTotalPages(value.totalPages);
        setDebug(prev => ({
          ...prev,
          lastFetchTime: new Date().toISOString(),
          exercisesCount: value.total,
          totalPages: value.totalPages,
          apiResponse: value,
          searchParams: {searchParams}
        }));
        setError(null);
      })
      
    } catch (err) {
      console.error('Error loading exercises:', err);
      setError('Failed to load exercises');
      setDebug(prev => ({
        ...prev,
        lastError: err.message,
        errorTime: new Date().toISOString(),
        errorDetails: err
      }));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);


  const handlePageChange = (e, newPage) => {
    e.preventDefault()
    const newParams = {
      ...searchParams,
      page: newPage
    };
    setSearchParams(newParams)
    
  };

  const Pagination = () => (
    <div className="flex justify-center gap-2 mt-6">
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={(e) => handlePageChange(e, index + 1)}
            className={`px-4 py-2 rounded ${
              searchParams.page === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );

  const DebugPanel = () => (
    <div className="bg-gray-100 p-4 mt-4 rounded-lg">
      <h3 className="font-bold mb-2">Debug Information</h3>
      <pre className="text-sm overflow-auto">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  );

  if (error) {
    return (
      <div>
        <div className="text-red-500 text-center py-4">{error}</div>
        <DebugPanel />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar searchParams={searchParams} setSearchParams={setSearchParams}/>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.ExerciseID} 
                exercise={exercise}
                onError={(err) => {
                  console.error('ExerciseCard error:', err);
                  setDebug(prev => ({
                    ...prev,
                    cardErrors: [...(prev.cardErrors || []), {
                      time: new Date().toISOString(),
                      error: err.message,
                      exerciseId: exercise.ExerciseID
                    }]
                  }));
                }}
                searchContent={searchParams.keyword} 
              />
            ))}
            {exercises.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No exercises found
              </div>
            )}
          </div>
          
          {/* <div className="flex justify-center gap-2 mt-6">
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={(e) => handlePageChange(e, index + 1)}
                  className={`px-4 py-2 rounded ${
                    searchParams.page === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div> */}
          <Pagination />
          
          {/* {process.env.NODE_ENV === 'development' && <DebugPanel />} */}
        </>
      )}
    </div>
  );
}

export default ExerciseList;
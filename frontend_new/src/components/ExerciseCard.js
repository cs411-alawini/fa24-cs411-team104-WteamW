import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router";
import Modal from './Modal';
import Notes from './Notes';
import api from '../services/api';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useCookies } from 'react-cookie';
import SubmitAnswer from './SubmitAnswer';

function ExerciseCard({ exercise, onStar, onUnstar, isStarred: initialIsStarred, showAccessTime, searchContent }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isStarred, setIsStarred] = useState(initialIsStarred);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false); // Distinct state for Notes
  const [mloadingNotes, setmLoadingNotes] = useState(false); // Distinct state for Notes
  const [showSubmitAnswer, setShowSubmitAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const [savingAnswer, setSavingAnswer] = useState(false); // Distinct state for SubmitAnswer
  const [mloadingAnswer, setmLoadingAnswer] = useState(false); // Distinct state for SubmitAnswer
  const [cookies, setCookie] = useCookies(['id', 'password']);
  const navigate = useNavigate();

  useEffect(() => {
    setIsStarred(initialIsStarred);
  }, [initialIsStarred]);

  const handleStarClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isStarred) {
        await api.unstarExercise(exercise.ExerciseID);
        setIsStarred(false);
        onUnstar?.(exercise.ExerciseID);
      } else {
        await api.starExercise(exercise.ExerciseID);
        setIsStarred(true);
        onStar?.(exercise.ExerciseID);
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async () => {
    try {
      setShowDetail(true)
      const params = {
        userId: cookies.id,
        password: cookies.password,
        exerciseId: exercise.ExerciseID,
        searchContent: searchContent
      }
      await api.addToExploreHistory(params)
    } catch (error) {
      console.error(error)
    }
    
  }

  const handleShowAnswer = async () => {
    try {
      setShowAnswer(true)
      const params = { userId: cookies.id, password: cookies.password, exerciseId: exercise.ExerciseID, answerContent: ''}
      await api.saveAnswers(params)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-gray-500 text-sm">#{exercise.ExerciseID}</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {exercise.Category}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-sm rounded ${
              exercise.DifficultyLevel === 'Very Easy' ? 'bg-gray-100 text-gray-800' :
              exercise.DifficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
              exercise.DifficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              exercise.DifficultyLevel === 'Hard' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800' 
            }`}>
              {exercise.DifficultyLevel}
            </span>
          </div>
        </div>
        <div className="text-gray-600 mb-4 line-clamp-2">
          <Latex>{exercise.QuestionContent}</Latex>
        </div>
        {/* <p className="text-gray-600 mb-4 line-clamp-2">{exercise.QuestionContent}</p> */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Type: {exercise.ExerciseType}</span>
          {showAccessTime && (
            <span>Last accessed: {new Date(exercise.ExploreTime).toLocaleString()}</span>
          )}
          <button 
            onClick={handleViewDetails}
            className="text-blue-500 hover:text-blue-600"
          >
            View Details
          </button>
        </div>
      </div>

      <Modal 
        isOpen={showDetail} 
        onClose={() => {
          setShowDetail(false);
          setShowAnswer(false);
          setShowNotes(false)
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-gray-500 text-sm">#{exercise.ExerciseID}</span>
              <h2 className="text-2xl font-semibold">{exercise.Category}</h2>
            </div>
            <span className={`px-3 py-1 text-sm rounded ${
              exercise.DifficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
              exercise.DifficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {exercise.DifficultyLevel}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Question:</h3>
              <div className="text-gray-700">
                <Latex>{exercise.QuestionContent}</Latex>
              </div>
            </div>
            
            {exercise.Hints && (
              <div>
                <h3 className="font-medium mb-2">Hints:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {exercise.Hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              {!showAnswer ? (
                <div>
                  <button
                    onClick={handleShowAnswer}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                  >
                    Show Answer
                  </button>
                  <button
                    onClick={() => setShowNotes(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                  >
                    Take Notes
                  </button>
                  <button
                    onClick={() => setShowSubmitAnswer(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Submit Answer
                  </button>
                </div>
                
                
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Answer:</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <Latex>{exercise.AnswerContent}</Latex>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <Notes 
        isOpen={showNotes} 
        onClose={() => setShowNotes(false)} 
        QuestionContent={exercise.QuestionContent} 
        params={{userId: cookies.id, password: cookies.password, exerciseId: exercise.ExerciseID}}
        notes={notes}
        setNotes={setNotes}
        saving={savingNotes}
        setSaving={setSavingNotes}
        mloading={mloadingNotes}
        setmLoading={setmLoadingNotes}
      />
      <SubmitAnswer
        isOpen={showSubmitAnswer}
        onClose={() => setShowSubmitAnswer(false)}
        QuestionContent={exercise.QuestionContent}
        params={{ userId: cookies.id, password: cookies.password, exerciseId: exercise.ExerciseID }}
        answer={answer}
        setAnswer={setAnswer}
        saving={savingAnswer}
        setSaving={setSavingAnswer}
        mloading={mloadingAnswer}
        setmLoading={setmLoadingAnswer}
      />
    </>
  );
}

export default ExerciseCard;
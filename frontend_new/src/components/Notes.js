// frontend/src/components/Notes.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../services/api';
import Latex from 'react-latex-next';

function Notes({ isOpen, onClose, params, 
  notes, setNotes, QuestionContent,
  saving, setSaving, mloading, setmLoading
   }) {
  // const [notes, setNotes] = useState('');
  // const [saving, setSaving] = useState(false);
  // const [mloading, setmLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await api.getNotes(params)
        console.log(response.data);
        if (response.data.length) {
          setNotes(response.data[0].NoteContent);
        } else {
          setNotes('');
        }
        
      } catch(error) {
        console.log(error)
        setError('Error loading notes, please try again.');
      }
    }
    if (isOpen) {
      console.log('start');
      setmLoading(true); // Reset loading state
      fetchData().then(setmLoading(false))
  
    } else {
      setNotes('');
    }
  }, [isOpen, onClose]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const params2 = {...params, noteContent: notes}
      await api.saveNotes(params2);
      // onSave?.();
      setSaving(false);
      onClose();
    } catch (error) {
      setError('Error saving notes. Please try again.');
      console.error('Error saving notes:', error);
    } 
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 md:mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Notes</h2>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <div className="text-gray-700">
            <Latex>{QuestionContent}</Latex>
        </div>
        <textarea
          className="w-full h-64 p-2 border rounded-md mb-4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your notes here..."
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || mloading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              saving || mloading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {mloading ? 'Loading...' : (saving ? 'Saving...' : 'Save Notes')}
          </button>
        </div>
      </div>
      </div>
      </div>
  );
}

export default Notes;
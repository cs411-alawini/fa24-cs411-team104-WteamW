import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../services/api';
const Concepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState([{}]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.analyseMathConcepts().then(
      (value) => {
        //console.log(value.data[0])
        setConcepts(value.data[0])
        setLoading(false)
      }
    )
  }, []);
  return (
    <>
      {loading ? (
        <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) :
      (<>
        <div className="py-6">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-600">Math Concepts Overview</h1>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {concepts.map((concept, idx) => (
              <div key={idx} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-2 text-purple-800">{concept.ConceptName}</h2>
                <p className="text-gray-700"><strong>Total Exercises:</strong> {concept.total_exercises}</p>
                <p className="text-gray-700"><strong>Total Students:</strong> {concept.total_students}</p>
                <p className="text-gray-700"><strong>High Score Students:</strong> {concept.high_scores}</p>
                <div className="mt-4">
                  <span 
                    className="inline-block text-lg font-semibold text-green-600 bg-green-100 rounded-full px-3 py-1"
                  >
                    Average Score: {concept.avg_score}
                  </span>
                </div>
                <button 
                    className="mt-4 block text-lg font-semibold text-blue-600"
                    onClick={() => {setShowDetail(true); setSelectedConcept(concept)}}
                  >
                    View Description
                  </button>
              </div>
            ))}
          </div>
        </div>
        <Modal 
          isOpen={showDetail} 
          onClose={() => {
            setShowDetail(false);
          }}
        >
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2 text-purple-800">{selectedConcept.ConceptName}</h2>
            <p className="text-gray-700 mb-4">{selectedConcept.ConceptDescription}</p>
          </div>
        </Modal>
      </>)}
    </>
  );
};

export default Concepts;
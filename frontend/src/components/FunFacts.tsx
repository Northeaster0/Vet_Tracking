import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FunFact {
  id: number;
  header: string;
  fact: string;
}

const FunFacts: React.FC = () => {
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchFunFacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/funfacts');
        setFunFacts(response.data);
      } catch (error) {
        console.error('Funfacts getirme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunFacts();
  }, []);

  useEffect(() => {
    if (funFacts.length > 0) {
      const timer = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
          setIsTransitioning(false);
        }, 300); // Transition duration
      }, 3000); // Her 3 saniyede bir değişecek

      return () => clearInterval(timer);
    }
  }, [funFacts]);

  if (loading) {
    return <div className="animate-pulse h-32"></div>;
  }

  if (funFacts.length === 0) {
    return null;
  }

  const currentFact = funFacts[currentIndex];

  return (
    <div className="mb-8">
      <div className="text-left">
        <h3 className={`text-xl font-bold text-blue-900 mb-2 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {currentFact.header}
        </h3>
        <p className={`text-gray-700 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {currentFact.fact}
        </p>
      </div>
    </div>
  );
};

export default FunFacts; 
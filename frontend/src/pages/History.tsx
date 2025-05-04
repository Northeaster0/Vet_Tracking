import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const History: React.FC = () => {
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const doctor = localStorage.getItem('doctorName'); // Girişte kaydedilmiş olmalı

  useEffect(() => {
    if (!doctor) return;
    fetch(`http://localhost:5000/api/operations/doctor?doctor=${encodeURIComponent(doctor)}`)
      .then(res => res.json())
      .then(data => {
        setOperations(data);
        setLoading(false);
      });
  }, [doctor]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Geçmiş İşlemler
          </h2>

          {loading ? <div>Yükleniyor...</div> : (
            <div className="space-y-4">
              {operations.length === 0 && <div>Operasyon kaydı yok.</div>}
              {operations.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Hayvan İsmi</span>
                      <p className="font-semibold text-gray-800">{item.animalName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tarih</span>
                      <p className="font-semibold text-gray-800">{item.CreatedAt}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">İşlem</span>
                      <p className="font-semibold text-blue-600">{item.OpDetail}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Doktor</span>
                      <p className="font-semibold text-gray-800">{item.Doctor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History; 
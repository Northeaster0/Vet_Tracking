import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVetAuth } from '../../contexts/VetAuthContext';

const History: React.FC = () => {
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { vet } = useVetAuth();
  const doctorName = vet ? `Dr. ${vet.FName} ${vet.LName}` : '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctorName) return;
    fetch(`http://localhost:5000/api/operations/doctor?doctor=${encodeURIComponent(doctorName)}`)
      .then(res => res.json())
      .then(data => {
        setOperations(data);
        setLoading(false);
      });
  }, [doctorName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📋</span> Geçmiş İşlemler
              </h2>
              <p className="text-sm text-gray-500">Doktorun gerçekleştirdiği tüm işlemlerin listesi</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Ana Kart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="text-center text-gray-500">Yükleniyor...</div>
          ) : (
            <div className="space-y-4">
              {operations.length === 0 && (
                <div className="text-center text-gray-500">Operasyon kaydı yok.</div>
              )}
              {operations.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-[#d68f13] transition duration-300 transform hover:scale-[1.01]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      <p className="font-semibold text-[#d68f13]">{item.OpDetail}</p>
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
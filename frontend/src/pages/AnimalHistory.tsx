import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AnimalHistory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (!animalId) return;
    fetch(`http://localhost:5000/api/prescriptions?animalId=${animalId}`)
      .then(res => res.json())
      .then(data => setPrescriptions(Array.isArray(data) ? data : []));
  }, [animalId]);

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/prescriptions/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setPrescriptions(prev => prev.filter(p => p.PrescriptionID !== id));
    } else {
      alert(data.message || 'Reçete silinemedi!');
    }
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Reçete Geçmişi</h2>
              <p className="text-sm text-gray-500">Hastanın reçete kayıtlarını görüntüleyin</p>
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

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {prescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">Henüz reçete kaydı bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div 
                  key={prescription.PrescriptionID}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 hover:border-[#d68f13]/30 transition duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">

                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#d68f13] transition duration-300">
                          {prescription.MedicineName || 'Reçete Bilgisi'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-500">Uygulama Şekli</p>
                          <p className="text-gray-700">{prescription.Method || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Doz</p>
                          <p className="text-gray-700">{prescription.Dose || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sıklık</p>
                          <p className="text-gray-700">{prescription.Frequency || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tarih</p>
                        <p className="text-gray-700">{prescription.Date || '-'}</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(prescription.PrescriptionID)}
                        className="text-gray-400 hover:text-[#d68f13] transition duration-300 p-2"
                        title="Reçeteyi Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d68f13]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reçeteyi Silmek İstiyor Musunuz?</h3>
                <p className="text-gray-600 mb-6">Bu işlem geri alınamaz.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-4 py-2 bg-[#d68f13] text-white rounded-lg hover:bg-[#b8770f] transition duration-300"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalHistory;
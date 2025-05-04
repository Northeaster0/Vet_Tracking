import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const procedures = [
  { id: 1, name: 'Sol arka bacak dikiş', date: '2025-02-15' },
  { id: 2, name: 'Genel muayene', date: '2025-01-05' },
  { id: 3, name: 'Kısırlaştırma operasyonu', date: '2024-11-02' }
];

const AnimalHistory: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    if (!animalId) return;
    fetch(`http://localhost:5000/api/prescriptions?animalId=${animalId}`)
      .then(res => res.json())
      .then(data => setPrescriptions(Array.isArray(data) ? data : []));
  }, [animalId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu reçeteyi silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`http://localhost:5000/api/prescriptions/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setPrescriptions(prev => prev.filter(p => p.PrescriptionID !== id));
    } else {
      alert(data.message || 'Reçete silinemedi!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            to={`/patientAcception?animalId=${animalId}`} 
            className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
          >
            ←
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Reçeteler
          </h2>

          <div className="space-y-4">
            {prescriptions.length === 0 ? (
              <div className="text-gray-500">Reçete kaydı yok.</div>
            ) : (
              prescriptions.map((prescription) => (
                <div 
                  key={prescription.PrescriptionID}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {prescription.MedicineName || '-'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Uygulama Şekli: {prescription.Method}
                      </p>
                      <p className="text-sm text-gray-600">
                        Doz: {prescription.Dose}
                      </p>
                      <p className="text-sm text-gray-600">
                        Sıklık: {prescription.Frequency}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Tarih:</span>
                      <button
                        onClick={() => handleDelete(prescription.PrescriptionID)}
                        className="text-red-600 hover:text-red-800 text-2xl font-bold"
                        title="Reçeteyi Sil"
                      >
                        –
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalHistory; 
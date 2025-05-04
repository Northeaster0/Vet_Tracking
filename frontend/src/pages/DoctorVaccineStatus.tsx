import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Vaccine {
  VaccineForAnimalID: number;
  Name: string;
  Type: string;
  Description: string;
  VaccineID: number;
}

interface VaccineListItem {
  id: number;
  name: string;
}

const DoctorVaccineStatus: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const [doneVaccines, setDoneVaccines] = useState<Vaccine[]>([]);
  const [vaccineList, setVaccineList] = useState<VaccineListItem[]>([]);
  const [selectedVaccineId, setSelectedVaccineId] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const fetchVaccines = async () => {
    if (!animalId) return;
    const done = await fetch(`http://localhost:5000/api/animal-vaccines/${animalId}`).then(res => res.json());
    setDoneVaccines(done);
    const allVaccines = await fetch('http://localhost:5000/api/vaccines').then(res => res.json());
    setVaccineList(allVaccines.map((v: any) => ({ id: v.id ?? v.VaccineID, name: v.name ?? v.Name })));
    setSelectedVaccineId('');
  };

  useEffect(() => {
    fetchVaccines();
  }, [animalId]);

  const handleAddVaccine = async () => {
    if (!selectedVaccineId) return;
    const res = await fetch('http://localhost:5000/api/animal-vaccines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animalId, vaccineId: selectedVaccineId })
    });
    const data = await res.json();
    if (data.success) {
      setMessage('✅ Aşı başarıyla eklendi!');
      fetchVaccines();
    } else {
      setMessage('❌ ' + (data.error || 'Aşı eklenemedi!'));
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteVaccine = async (vaccineForAnimalId: number) => {
    const res = await fetch(`http://localhost:5000/api/animal-vaccines/${vaccineForAnimalId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      setMessage('✅ Aşı kaydı silindi!');
      fetchVaccines();
    } else {
      setMessage('❌ ' + (data.error || 'Aşı kaydı silinemedi!'));
    }
    setShowDeleteConfirm(null);
    setTimeout(() => setMessage(''), 3000);
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Aşı Yönetimi</h2>
              <p className="text-sm text-gray-500">Hastanın aşı kayıtlarını görüntüleyin ve yönetin</p>
            </div>
          </div>
          <Link
            to={`/patientAcception?animalId=${animalId}`}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Vaccines List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">💉</span>
            Yapılan Aşılar
          </h2>
          <div className="space-y-4">
            {doneVaccines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">Bu hayvana henüz aşı yapılmamış. 🐾</p>
              </div>
            ) : (
              doneVaccines.map((vaccine) => (
                <div 
                  key={vaccine.VaccineForAnimalID} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 hover:border-[#d68f13]/30 transition duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#d68f13] transition duration-300">
                          {vaccine.Name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-500">Tip</p>
                            <p className="text-gray-700">{vaccine.Type || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Açıklama</p>
                            <p className="text-gray-700">{vaccine.Description || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(vaccine.VaccineForAnimalID)}
                      className="text-gray-400 hover:text-[#d68f13] transition duration-300 p-2"
                      title="Aşıyı Sil"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Vaccine Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">➕</span>
            Yeni Aşı Ekle
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aşı Seçiniz 💉
              </label>
              <select
                value={selectedVaccineId}
                onChange={e => setSelectedVaccineId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
              >
                <option value="">Aşı seçin...</option>
                {vaccineList.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddVaccine}
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              disabled={!selectedVaccineId}
            >
              <span>💉</span>
              <span>Aşı Ekle</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d68f13]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aşı Kaydını Silmek İstiyor Musunuz?</h3>
                <p className="text-gray-600 mb-6">Bu işlem geri alınamaz.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleDeleteVaccine(showDeleteConfirm)}
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

export default DoctorVaccineStatus;
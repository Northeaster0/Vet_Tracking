import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Vaccine {
  VaccineForAnimalID: number;
  Name: string;
  Type: string;
  Description: string;
  VaccineID: number;
}

interface AvailableVaccine {
  VaccineID: number;
  Name: string;
  Type: string;
  ApplicationMethod: string;
  Description: string;
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

  const fetchVaccines = async () => {
    if (!animalId) return;
    // Yapılan aşılar
    const done = await fetch(`http://localhost:5000/api/animal-vaccines/${animalId}`).then(res => res.json());
    setDoneVaccines(done);
    // Tüm aşılar
    const allVaccines = await fetch('http://localhost:5000/api/vaccines').then(res => res.json());
    setVaccineList(allVaccines.map((v: any) => ({ id: v.id ?? v.VaccineID, name: v.name ?? v.Name })));
    setSelectedVaccineId('');
  };

  useEffect(() => {
    fetchVaccines();
    // eslint-disable-next-line
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
      setMessage('Aşı başarıyla eklendi!');
      fetchVaccines();
    } else {
      setMessage(data.error || 'Aşı eklenemedi!');
    }
  };

  const handleDeleteVaccine = async (vaccineForAnimalId: number) => {
    const res = await fetch(`http://localhost:5000/api/animal-vaccines/${vaccineForAnimalId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Aşı kaydı silindi!');
      fetchVaccines();
    } else {
      setMessage(data.error || 'Aşı kaydı silinemedi!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to={`/patientAcception?animalId=${animalId}`} 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Yapılan Aşılar
          </h2>
          <div className="space-y-4">
            {doneVaccines.length === 0 ? (
              <div className="text-gray-500">Bu hayvana henüz aşı yapılmamış.</div>
            ) : (
              doneVaccines.map((vaccine) => (
                <div key={vaccine.VaccineForAnimalID} className="border rounded-lg p-4 hover:shadow-md transition duration-300 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{vaccine.Name}</h3>
                    <p className="text-sm text-gray-600">Tip: {vaccine.Type}</p>
                    <p className="text-sm text-gray-600">Açıklama: {vaccine.Description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteVaccine(vaccine.VaccineForAnimalID)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Yeni Aşı Ekle
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aşı Seçiniz
              </label>
              <select
                value={selectedVaccineId}
                onChange={e => setSelectedVaccineId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Aşı seçin</option>
                {vaccineList.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddVaccine}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={!selectedVaccineId}
            >
              Aşı Ekle
            </button>
            {message && <div className="mt-2 text-center text-blue-900 font-semibold">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVaccineStatus; 
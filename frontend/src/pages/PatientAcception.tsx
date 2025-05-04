import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PatientAcception: React.FC = () => {
  const [animalInfo, setAnimalInfo] = useState<any>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

  useEffect(() => {
    if (!animalId) return;
    fetch('http://localhost:5000/api/animals/with-details')
      .then(res => res.json())
      .then(data => {
        const found = data.find((a: any) => String(a.AnimalID) === String(animalId));
        setAnimalInfo(found);
      });
  }, [animalId]);

  if (!animalInfo) return <div>Yükleniyor...</div>;

  const actionButtons = [
    { title: 'Randevu Al', path: `/addAppointment?animalId=${animalInfo.AnimalID}`, color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Radyoloji ve Labaratuvar Sonuçları ', path: `/tests?animalId=${animalInfo.AnimalID}`, color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Geçmiş', path: `/animalHistory?animalId=${animalInfo.AnimalID}`, color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'Reçete Ekle', path: `/addPrescriptions?animalId=${animalInfo.AnimalID}`, color: 'bg-yellow-600 hover:bg-yellow-700' },
    { title: 'Bilgileri Düzenle', path: `/editPatientInfo?animalId=${animalInfo.AnimalID}`, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { title: 'Aşı', path: `/doctorVaccineStatus?animalId=${animalInfo.AnimalID}`, color: 'bg-red-600 hover:bg-red-700' },
    { title: 'Raporlarım', path: `/patient-raports?animalId=${animalInfo.AnimalID}`, color: 'bg-pink-600 hover:bg-pink-700' },
    { title: 'Operasyonlar', path: `/operations?animalId=${animalInfo.AnimalID}`, color: 'bg-gray-600 hover:bg-gray-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            {animalInfo.animalName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Sahip:</span> {animalInfo.ownerName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Tür:</span> {animalInfo.type}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Irk:</span> {animalInfo.breed}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Pasaport No:</span> {animalInfo.passportNo}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Yaş:</span> {animalInfo.age}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Cinsiyet:</span> {animalInfo.gender}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Kilo:</span> {animalInfo.weight} kg
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionButtons.map((button, index) => (
            <Link
              key={index}
              to={button.path}
              className={`${button.color} text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 flex items-center justify-center text-center`}
            >
              <span className="text-lg font-semibold">{button.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientAcception; 
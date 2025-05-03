import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const userInfo = {
  name: 'Ayşe',
  surname: 'Yılmaz'
};

const animals = [
  {
    id: 1,
    name: 'Pamuk',
    type: 'Kedi',
    breed: 'Tekir',
    gender: 'Dişi',
    age: '3',
    passportNo: 'TR123456789',
    weight: '4.2 kg',
    color: 'Beyaz',
    allergies: 'Yok'
  },
  {
    id: 2,
    name: 'Karabaş',
    type: 'Köpek',
    breed: 'Golden Retriever',
    gender: 'Erkek',
    age: '5',
    passportNo: 'TR987654321',
    weight: '25 kg',
    color: 'Altın',
    allergies: 'Yok'
  }
];

const navigationButtons = [
  { title: 'Profil', path: '/patientProfile', color: 'bg-blue-600 hover:bg-blue-700' },
  { title: 'Geçmiş', path: '/patientPrescriptionsHistory', color: 'bg-green-600 hover:bg-green-700' },
  { title: 'Sonuçlar', path: '/patientTestResults', color: 'bg-purple-600 hover:bg-purple-700' },
  { title: 'Aşı Durumu', path: '/patientVaccineStatus', color: 'bg-yellow-600 hover:bg-yellow-700' },
  { title: 'Çıkış Yap', path: '/', color: 'bg-red-600 hover:bg-red-700' }
];

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [showAnimalInfo, setShowAnimalInfo] = useState(false);

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const animalId = parseInt(e.target.value);
    setSelectedAnimal(animalId);
    setShowAnimalInfo(true);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const selectedAnimalData = animals.find(animal => animal.id === selectedAnimal);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Üst Kısım */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Müşteri: {userInfo.name} {userInfo.surname}
            </h1>
            <Link
              to="/whatsWrong"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Sorun Bildir
            </Link>
          </div>
          <p className="text-gray-600 mb-4">Lütfen hayvanınızı seçiniz</p>

          {/* Hayvan Seçim Dropdown */}
          <div className="mb-6">
            <select
              value={selectedAnimal || ''}
              onChange={handleAnimalChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Hayvan Seçiniz</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} ({animal.type})
                </option>
              ))}
            </select>
          </div>

          {/* Seçilen Hayvan Bilgileri */}
          {showAnimalInfo && selectedAnimalData && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4">{selectedAnimalData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Tür:</span> {selectedAnimalData.type}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Irk:</span> {selectedAnimalData.breed}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Cinsiyet:</span> {selectedAnimalData.gender}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Yaş:</span> {selectedAnimalData.age}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Pasaport No:</span> {selectedAnimalData.passportNo}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Kilo:</span> {selectedAnimalData.weight}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Renk:</span> {selectedAnimalData.color}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Alerjiler:</span> {selectedAnimalData.allergies}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigasyon Butonları */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {navigationButtons.map((button, index) => (
            <Link
              key={index}
              to={button.path}
              onClick={button.title === 'Çıkış Yap' ? handleLogout : undefined}
              className={`${button.color} text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 flex items-center justify-center text-center ${
                button.title !== 'Çıkış Yap' && !selectedAnimal ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <span className="text-lg font-semibold">{button.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 
import React from 'react';
import { Link } from 'react-router-dom';

const PatientAcception: React.FC = () => {
  // Statik hayvan bilgileri (ileride veritabanından gelecek)
  const animalInfo = {
    ownerName: 'Ahmet Yılmaz',
    animalName: 'Pamuk',
    passportNo: 'TR123456789',
    age: '3',
    type: 'Kedi',
    breed: 'Tekir',
    gender: 'Dişi',
    weight: '4.2 kg',
    color: 'Beyaz',
    allergies: 'Yok'
  };

  const actionButtons = [
    { title: 'Randevu Al', path: '/addAppointment', color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Radyoloji ve Labaratuvar Sonuçları ', path: '/tests', color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Geçmiş', path: '/animalHistory', color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'Reçete Ekle', path: '/addPrescriptions', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { title: 'Bilgileri Düzenle', path: '/editPatientInfo', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { title: 'Aşı', path: '/doctorVaccineStatus', color: 'bg-red-600 hover:bg-red-700' },
    { title: 'Raporlarım', path: '/patient-raports', color: 'bg-pink-600 hover:bg-pink-700' }
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
            Hayvan Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Sahip İsmi:</span> {animalInfo.ownerName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Hayvan İsmi:</span> {animalInfo.animalName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Pasaport No:</span> {animalInfo.passportNo}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Yaşı:</span> {animalInfo.age}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Türü:</span> {animalInfo.type}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Irkı:</span> {animalInfo.breed}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Cinsiyeti:</span> {animalInfo.gender}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Kilosu:</span> {animalInfo.weight}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Rengi:</span> {animalInfo.color}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Alerjileri:</span> {animalInfo.allergies}
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
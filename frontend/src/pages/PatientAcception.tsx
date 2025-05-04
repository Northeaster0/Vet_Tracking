import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const calculateAge = (dateOfBirth: string) => {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const PatientAcception: React.FC = () => {
  const [animalInfo, setAnimalInfo] = useState<any>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!animalId) return;
    fetch(`http://localhost:5000/api/animals/with-details?animalId=${animalId}`)
      .then(res => res.json())
      .then(data => setAnimalInfo(data));
  }, [animalId]);

  if (!animalInfo) return <div className="text-center py-8 text-gray-600">Yükleniyor...</div>;

  const actionButtons = [
    { title: 'Randevu Oluştur', path: `/addAppointment?animalId=${animalInfo.AnimalID}`, color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Radyoloji ve Labaratuvar Sonuçları ', path: `/tests?animalId=${animalInfo.AnimalID}`, color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Geçmiş Reçeteler', path: `/animalHistory?animalId=${animalInfo.AnimalID}`, color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'Reçete Ekle', path: `/addPrescriptions?animalId=${animalInfo.AnimalID}`, color: 'bg-yellow-600 hover:bg-yellow-700' },
    { title: 'Bilgileri Düzenle', path: `/editPatientInfo?animalId=${animalInfo.AnimalID}`, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { title: 'Aşı', path: `/doctorVaccineStatus?animalId=${animalInfo.AnimalID}`, color: 'bg-red-600 hover:bg-red-700' },
    { title: 'Raporlarım', path: `/patient-reports?animalId=${animalInfo.AnimalID}`, color: 'bg-pink-600 hover:bg-pink-700' },
    { title: 'Geçmiş Operasyonlar', path: `/operations?animalId=${animalInfo.AnimalID}`, color: 'bg-gray-600 hover:bg-gray-700' },
    { title: 'Anamnezler', path: `/anamnezs?animalId=${animalInfo.AnimalID}`, color: 'bg-blue-700 hover:bg-blue-800' }

  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Hasta Detayları</h2>
              <p className="text-sm text-gray-500">Hasta işlemlerini yönetin</p>
            </div>
          </div>
          <Link 
            to="/animal-process" 
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 group hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-[#d68f13]/10 p-2 rounded-lg mr-3">{animalInfo.Type === 'Kedi' ? '🐱' : '🐶'}</span>
            {animalInfo.Name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Sahip:</span> {animalInfo.OwnerFName} {animalInfo.OwnerLName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Tür:</span> {animalInfo.Type}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Irk:</span> {animalInfo.Breed}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Pasaport No:</span> {animalInfo.PassportNumber}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Yaş:</span> {animalInfo.DateOfBirth ? calculateAge(animalInfo.DateOfBirth) : '-'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Cinsiyet:</span> {animalInfo.Gender}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Kilo:</span> {animalInfo.Weight || '-'} kg
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionButtons.map((button, index) => (
            <Link
              key={index}
              to={button.path}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="bg-[#d68f13]/10 p-3 rounded-xl">
                    <span className="text-2xl">{button.color}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#d68f13] transition duration-300">
                    {button.title}
                  </h3>
                </div>
              </div>
              <div className="bg-[#d68f13]/5 px-6 py-3 border-t border-gray-100">
                <span className="text-[#d68f13] text-sm font-medium">İşleme Git →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientAcception;
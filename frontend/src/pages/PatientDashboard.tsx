import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const [animals, setAnimals] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [showAnimalInfo, setShowAnimalInfo] = useState(false);
  const [selectedAnimalData, setSelectedAnimalData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationButtons = [
    { title: 'Profil', path: '/patientProfile', color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Reçete Geçmişi', path: '/patientPrescriptionsHistory', color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Radyolojik ve Labaratuvar Sonuçları', path: '/patientTestResults', color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'Aşı Durumu', path: '/patientVaccineStatus', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { title: 'Nöbetçi Veterinerler', path: '/veterinarian-on-call', color: 'bg-pink-600 hover:bg-pink-700' },
    { title: 'Çıkış Yap', path: '/', color: 'bg-red-600 hover:bg-red-700' }
  ];

  // Yaş hesaplama fonksiyonu
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

  useEffect(() => {
    const owner = JSON.parse(localStorage.getItem('owner') || '{}');
    setUserInfo(owner);
    const searchParams = new URLSearchParams(location.search);
    const animalIdParam = searchParams.get('animalId');

    if (owner.OwnerID) {
      fetch(`http://localhost:5000/api/animals/with-details?ownerId=${owner.OwnerID}`)
        .then(res => res.json())
        .then(data => {
          setAnimals(data);
          // Eğer URL'de animalId varsa, onu seçili yap
          if (animalIdParam) {
            const found = data.find((a: any) => a.AnimalID === parseInt(animalIdParam));
            if (found) {
              setSelectedAnimal(found.AnimalID);
              setSelectedAnimalData(found);
              setShowAnimalInfo(true);
            }
          }
        });
    }
  }, [location.search]);

  const handleAnimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const animalId = parseInt(e.target.value);
    setSelectedAnimal(animalId);
    setShowAnimalInfo(true);
    const animal = animals.find(a => a.AnimalID === animalId);
    setSelectedAnimalData(animal);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Render fonksiyonunun başı
  console.log('selectedAnimalData:', selectedAnimalData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Üst Kısım */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Müşteri: {userInfo ? `${userInfo.FName} ${userInfo.LName}` : ''}
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
                <option key={animal.AnimalID} value={animal.AnimalID}>
                  {animal.Name} ({animal.Type || animal.Species || ''})
                </option>
              ))}
            </select>
          </div>

          {/* Seçilen Hayvan Bilgileri */}
          {showAnimalInfo && selectedAnimalData && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-4">{selectedAnimalData.Name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Tür:</span> {selectedAnimalData.Type}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Irk:</span> {selectedAnimalData.Breed}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Cinsiyet:</span> {selectedAnimalData.Gender}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Yaş:</span> {selectedAnimalData.DateOfBirth ? calculateAge(selectedAnimalData.DateOfBirth) : ''}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Pasaport No:</span> {selectedAnimalData.PassportNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Kilo:</span> {selectedAnimalData.Weight}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Renk:</span> {selectedAnimalData.Color}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-gray-800">Alerjiler:</span> {selectedAnimalData.Allergies || 'Yok'}
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
              to={
                button.title === 'Reçete Geçmişi' && selectedAnimal
                  ? `${button.path}?animalId=${selectedAnimal}`
                  : button.path
              }
              onClick={button.title === 'Çıkış Yap' ? handleLogout : undefined}
              className={`${button.color} text-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 flex items-center justify-center text-center ${
                (button.title !== 'Çıkış Yap' && button.title !== 'Profil' && !selectedAnimal) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
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
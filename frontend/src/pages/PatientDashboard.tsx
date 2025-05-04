import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const [animals, setAnimals] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [showAnimalInfo, setShowAnimalInfo] = useState(false);
  const [selectedAnimalData, setSelectedAnimalData] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationButtons = [
    { title: 'Profil', path: '/patientProfile', icon: '👤' },
    { title: 'Reçete Geçmişi', path: '/patientPrescriptionsHistory', icon: '💊' },
    { title: 'Radyoloji ve Labaratuvar Sonuçları', path: '/patientTestResults', icon: '🔬' },
    { title: 'Aşı Durumu', path: '/patientVaccineStatus', icon: '💉' }

  ];

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

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Müşteri Paneli</h2>
              <p className="text-sm text-gray-500">Hasta bilgilerinizi ve işlemlerinizi görüntüleyin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/whatsWrong"
              className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>⚠️</span>
              <span>Sorun Bildir</span>
            </Link>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-500 hover:text-[#d68f13] transition duration-300 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d68f13]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Çıkış Yapmak İstiyor Musunuz?</h3>
                <p className="text-gray-600 mb-6">Oturumunuz sonlandırılacak.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-[#d68f13] text-white rounded-lg hover:bg-[#b8770f] transition duration-300"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animal Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hayvan Seçimi</h3>
          <select
            value={selectedAnimal || ''}
            onChange={handleAnimalChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
          >
            <option value="">Hayvan Seçiniz</option>
            {animals.map((animal) => (
              <option key={animal.AnimalID} value={animal.AnimalID}>
                {animal.Name} ({animal.Type || animal.Species || ''})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Animal Info */}
        {showAnimalInfo && selectedAnimalData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 group hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-[#d68f13]/10 p-2 rounded-lg mr-3">
                {selectedAnimalData.Type === 'Kedi' ? '🐱' : '🐶'}
              </span>
              {selectedAnimalData.Name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
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
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Yaş:</span> {selectedAnimalData.DateOfBirth ? calculateAge(selectedAnimalData.DateOfBirth) : '-'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Pasaport No:</span> {selectedAnimalData.PassportNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Kilo:</span> {selectedAnimalData.Weight || '-'} kg
                </p>
              </div>
              <div className="col-span-2 space-y-3">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Renk:</span> {selectedAnimalData.Color}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Alerjiler:</span> {selectedAnimalData.Allergies || 'Yok'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationButtons.map((button, index) => (
            <Link
              key={index}
              to={
                button.title !== 'Profil' && selectedAnimal
                  ? `${button.path}?animalId=${selectedAnimal}`
                  : button.path
              }
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] overflow-hidden ${
                (button.title !== 'Profil' && !selectedAnimal) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="bg-[#d68f13]/10 p-3 rounded-xl">
                    <span className="text-2xl">{button.icon}</span>
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
          
          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] overflow-hidden text-left"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-2">
                <div className="bg-[#d68f13]/10 p-3 rounded-xl">
                  <span className="text-2xl">🚪</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#d68f13] transition duration-300">
                  Çıkış Yap
                </h3>
              </div>
            </div>
            <div className="bg-[#d68f13]/5 px-6 py-3 border-t border-gray-100">
              <span className="text-[#d68f13] text-sm font-medium">Oturumu Kapat →</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
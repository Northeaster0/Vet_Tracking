import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FindAnimals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animalList, setAnimalList] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/animals/with-details')
      .then(res => res.json())
      .then(data => setAnimalList(data));
  }, []);

  // Yaş hesaplama fonksiyonu
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const filteredAnimals = animalList.filter(animal => {
    const searchLower = searchTerm.toLowerCase();
    return (
      animal.Name.toLowerCase().includes(searchLower) ||
      (animal.Type && animal.Type.toLowerCase().includes(searchLower)) ||
      (animal.Breed && animal.Breed.toLowerCase().includes(searchLower)) ||
      (animal.PassportNumber && animal.PassportNumber.toLowerCase().includes(searchLower)) ||
      ((animal.OwnerFName + ' ' + animal.OwnerLName).toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🔍</span> Hayvan Ara
              </h2>
              <p className="text-sm text-gray-500">Hayvan adı, sahip adı, tür, ırk veya pasaport no ile arama yapın</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>←</span>
              <span>Geri Dön</span>
            </button>
            <button
              onClick={() => navigate('/whatsWrong')}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>Neyi Var Ki?</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <input
            type="text"
            placeholder="Hayvan adı, sahip adı, tür, ırk veya pasaport no ile arama yapın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
          />
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {filteredAnimals.map((animal) => (
            <button
              key={animal.AnimalID}
              onClick={() => navigate(`/patientAcception?animalId=${animal.AnimalID}`)}
              className="w-full text-left bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-[1.01]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {animal.Name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Sahip:</span> {animal.OwnerFName} {animal.OwnerLName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Tür:</span> {animal.Type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Irk:</span> {animal.Breed}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Pasaport No:</span> {animal.PassportNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Yaş:</span> {calculateAge(animal.DateOfBirth)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Cinsiyet:</span> {animal.Gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Kilo:</span> {animal.Weight} kg
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindAnimals; 
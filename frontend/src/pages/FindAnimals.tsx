import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Örnek hayvan verileri (ileride API'den gelecek)
const animals = [
  {
    id: 1,
    name: 'Pamuk',
    owner: 'Ayşe Yılmaz',
    species: 'Kedi',
    breed: 'Tekir',
    passportNo: 'TR123456789',
    age: '3',
    gender: 'Dişi',
    weight: '4.2 kg',
    color: 'Beyaz',
    allergies: 'Yok'
  },
  {
    id: 2,
    name: 'Karabaş',
    owner: 'Mehmet Demir',
    species: 'Köpek',
    breed: 'Golden Retriever',
    passportNo: 'TR987654321',
    age: '5',
    gender: 'Erkek',
    weight: '25 kg',
    color: 'Altın',
    allergies: 'Yok'
  },
  {
    id: 3,
    name: 'Minnoş',
    owner: 'Zeynep Kaya',
    species: 'Kedi',
    breed: 'British Shorthair',
    passportNo: 'TR456789123',
    age: '2',
    gender: 'Dişi',
    weight: '3.8 kg',
    color: 'Gri',
    allergies: 'Yok'
  }
];

const FindAnimals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnimals = animals.filter(animal => {
    const searchLower = searchTerm.toLowerCase();
    return (
      animal.name.toLowerCase().includes(searchLower) ||
      animal.owner.toLowerCase().includes(searchLower) ||
      animal.species.toLowerCase().includes(searchLower) ||
      animal.breed.toLowerCase().includes(searchLower) ||
      animal.passportNo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/animal-process" 
            className="text-blue-600 hover:text-blue-800 text-3xl font-bold inline-block"
          >
            ←
          </Link>
          <Link
            to="/whatsWrong"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Sorun Bildir
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">
          Hayvan Ara
        </h2>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Hayvan adı, sahip adı, tür, ırk veya pasaport no ile arama yapın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredAnimals.map((animal) => (
            <Link
              key={animal.id}
              to={`/patientAcception?animalId=${animal.id}`}
              className="block bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {animal.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Sahip:</span> {animal.owner}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Tür:</span> {animal.species}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Irk:</span> {animal.breed}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Pasaport No:</span> {animal.passportNo}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Yaş:</span> {animal.age}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Cinsiyet:</span> {animal.gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Kilo:</span> {animal.weight}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindAnimals; 
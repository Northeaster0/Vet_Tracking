import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
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

const EditPatientInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    ownerName: animalInfo.ownerName,
    animalName: animalInfo.animalName,
    passportNo: animalInfo.passportNo,
    age: animalInfo.age,
    type: animalInfo.type,
    breed: animalInfo.breed,
    gender: animalInfo.gender,
    weight: animalInfo.weight,
    color: animalInfo.color,
    allergies: animalInfo.allergies
  });
  const [animalTypes, setAnimalTypes] = useState<{ AnimalTypeID: number, Species: string, Breed: string }[]>([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

  useEffect(() => {
    fetch('http://localhost:5000/api/animal-types')
      .then(res => res.json())
      .then(data => setAnimalTypes(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    // AnimalTypeID bul
    const selectedType = animalTypes.find(
      t =>
        t.Species.trim().toLowerCase() === formData.type.trim().toLowerCase() &&
        t.Breed.trim().toLowerCase() === formData.breed.trim().toLowerCase()
    );
    if (!selectedType) {
      console.log('formData.type:', formData.type, 'formData.breed:', formData.breed);
      console.log('animalTypes:', animalTypes);
      setMessage('Tür ve ırk eşleşmesi bulunamadı!');
      setIsError(true);
      return;
    }
    // Yaştan doğum tarihi hesapla
    const age = parseInt(formData.age);
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const dateOfBirth = `${birthYear}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;
    const payload = {
      name: formData.animalName,
      gender: formData.gender,
      dateOfBirth,
      weight: formData.weight,
      color: formData.color,
      passportNumber: formData.passportNo,
      animalTypeId: selectedType.AnimalTypeID
    };
    try {
      const response = await fetch(`http://localhost:5000/api/animals/${animalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Bilgiler başarıyla güncellendi!');
        setIsError(false);
      } else {
        setMessage(data.message || 'Bilgiler güncellenemedi!');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Sunucuya bağlanılamadı!');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          to={`/patientAcception?animalId=${animalId}`} 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Hasta Bilgilerini Düzenle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Sahip İsmi
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="animalName" className="block text-sm font-medium text-gray-700 mb-1">
                  Hayvan İsmi
                </label>
                <input
                  type="text"
                  id="animalName"
                  name="animalName"
                  value={formData.animalName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="passportNo" className="block text-sm font-medium text-gray-700 mb-1">
                  Pasaport No
                </label>
                <input
                  type="text"
                  id="passportNo"
                  name="passportNo"
                  value={formData.passportNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Yaş
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tür
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Kedi">Kedi</option>
                  <option value="Köpek">Köpek</option>
                  <option value="Kuş">Kuş</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                  Irk
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Cinsiyet
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Dişi">Dişi</option>
                  <option value="Erkek">Erkek</option>
                </select>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Kilo
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Renk
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Alerjiler
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mt-6"
            >
              Bilgileri Güncelle
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center font-semibold ${isError ? 'text-red-600' : 'text-green-700'}`}>{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPatientInfo; 
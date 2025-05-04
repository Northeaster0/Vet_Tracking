import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddAnimal: React.FC = () => {
  const genders = ['Erkek', 'Dişi'];
  const [owners, setOwners] = useState<{ OwnerID: number, FName: string, LName: string }[]>([]);
  const [formData, setFormData] = useState({
    ownerId: '',
    animalName: '',
    passportNo: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    color: '',
    weight: '',
    allergies: ''
  });
  const [animalTypes, setAnimalTypes] = useState<{ AnimalTypeID: number, Species: string, Breed: string }[]>([]);
  const [allergyOptions, setAllergyOptions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/owners')
      .then(res => res.json())
      .then(data => setOwners(data));
    fetch('http://localhost:5000/api/animal-types')
      .then(res => res.json())
      .then(data => setAnimalTypes(data));
    fetch('http://localhost:5000/api/allergy-diseases')
      .then(res => res.json())
      .then(data => setAllergyOptions(['Yok', ...data.map((d: any) => d.Name)]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    
    const selectedType = animalTypes.find(
      t => t.Species === formData.type && t.Breed === formData.breed
    );
    if (!selectedType) {
      setMessage('Tür ve ırk eşleşmesi bulunamadı!');
      setIsError(true);
      return;
    }
    
    const age = parseInt(formData.age);
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const dateOfBirth = `${birthYear}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;
    
    const payload = {
      ownerId: formData.ownerId,
      animalTypeId: selectedType.AnimalTypeID,
      name: formData.animalName,
      gender: formData.gender,
      dateOfBirth,
      weight: formData.weight,
      color: formData.color,
      passportNumber: formData.passportNo,
      allergies: formData.allergies
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Hayvan başarıyla eklendi!');
        setIsError(false);
        setFormData({ ownerId: '', animalName: '', passportNo: '', type: '', breed: '', age: '', gender: '', color: '', weight: '', allergies: '' });
      } else {
        setMessage(data.message || 'Hayvan eklenemedi!');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Sunucuya bağlanılamadı!');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Yeni Hayvan Ekle</h2>
              <p className="text-sm text-gray-500">Sisteme yeni hayvan kaydı oluşturun</p>
            </div>
          </div>
          <Link
            to="/animal-process"
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Geri Dön
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Selection */}
              <div className="col-span-1">
                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri Seç
                </label>
                <select
                  id="ownerId"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                >
                  <option value="">Müşteri seçiniz</option>
                  {owners.map(owner => (
                    <option key={owner.OwnerID} value={owner.OwnerID}>
                      {owner.FName} {owner.LName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Animal Name */}
              <div className="col-span-1">
                <label htmlFor="animalName" className="block text-sm font-medium text-gray-700 mb-2">
                  Hayvan İsmi
                </label>
                <input
                  type="text"
                  id="animalName"
                  name="animalName"
                  value={formData.animalName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                />
              </div>

              {/* Passport Number */}
              <div className="col-span-1">
                <label htmlFor="passportNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Pasaport No
                </label>
                <input
                  type="text"
                  id="passportNo"
                  name="passportNo"
                  value={formData.passportNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                />
              </div>

              {/* Animal Type */}
              <div className="col-span-1">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Türü
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  {Array.from(new Set(animalTypes.map(t => t.Species))).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Breed */}
              <div className="col-span-1">
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
                  Irkı
                </label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                  disabled={!formData.type}
                >
                  <option value="">Seçiniz</option>
                  {formData.type && animalTypes.filter(t => t.Species === formData.type).map(t => (
                    <option key={t.Breed} value={t.Breed}>{t.Breed}</option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div className="col-span-1">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Yaşı
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                  min="0"
                />
              </div>

              {/* Gender */}
              <div className="col-span-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Cinsiyeti
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div className="col-span-1">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Rengi
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                />
              </div>

              {/* Weight */}
              <div className="col-span-1">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Kilosu
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Allergies */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                  Alerjileri
                </label>
                <select
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  {allergyOptions.map(allergy => (
                    <option key={allergy} value={allergy}>{allergy}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg mt-6 font-semibold"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAnimal;
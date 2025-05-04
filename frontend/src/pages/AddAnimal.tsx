import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddAnimal: React.FC = () => {
  // Örnek veriler (ileride veritabanından gelecek)
  const genders = ['Erkek', 'Dişi'];
  const allergies = ['Polen', 'Tavuk Eti', 'Süt', 'Yok'];

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
    // AnimalTypeID bul
    const selectedType = animalTypes.find(
      t => t.Species === formData.type && t.Breed === formData.breed
    );
    if (!selectedType) {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Yeni Hayvan Ekle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
                Müşteri Seç
              </label>
              <select
                id="ownerId"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Türü
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                {Array.from(new Set(animalTypes.map(t => t.Species))).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                Irkı
              </label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.type}
              >
                <option value="">Seçiniz</option>
                {formData.type && animalTypes.filter(t => t.Species === formData.type).map(t => (
                  <option key={t.Breed} value={t.Breed}>{t.Breed}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Yaşı
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Cinsiyeti
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Rengi
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
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Kilosu
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                Alerjileri
              </label>
              <select
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                {allergyOptions.map(allergy => (
                  <option key={allergy} value={allergy}>{allergy}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 mt-6"
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
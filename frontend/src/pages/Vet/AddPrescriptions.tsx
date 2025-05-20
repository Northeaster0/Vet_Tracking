import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVetAuth } from '../../contexts/VetAuthContext';

const applicationMethods = [
  { id: 1, name: 'Ağızdan' },
  { id: 2, name: 'Deri altı' },
  { id: 3, name: 'Kas içi' },
  { id: 4, name: 'Topikal' }
];

const frequencyTypes = [
  { id: 1, name: 'Günde' },
  { id: 2, name: 'Haftada' },
  { id: 3, name: 'Ayda' }
];

const AddPrescriptions: React.FC = () => {
  const [formData, setFormData] = useState({
    disease: '',
    medicineId: '',
    dose: '',
    applicationMethod: '',
    frequencyType: '',
    frequencyCount: '',
    duration: ''
  });
  const [diseases, setDiseases] = useState<{id:number, name:string, description:string, category:string}[]>([]);
  const [medicines, setMedicines] = useState<{id:number, name:string, activeSubstance:string}[]>([]);
  const [selectedActiveSubstance, setSelectedActiveSubstance] = useState('');
  const [animal, setAnimal] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const { vet } = useVetAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/diseases')
      .then(res => res.json())
      .then(data => setDiseases(data.map((d: any) => ({
        id: d.id,
        name: d.Name || d.name,
        description: d.Description || d.description,
        category: d.Category || d.category
      }))));
    fetch('http://localhost:5000/api/medicines')
      .then(res => res.json())
      .then(data => {
        console.log('APIden gelen ilaç verisi:', data);
        setMedicines(data.map((m: any) => ({
          id: m.id || m.MedicineID,
          name: m.Name || m.name,
          activeSubstance: m.ActiveSubstance || m.activeSubstance || m.active_substance || m.activesubstance || ''
        })));
      });
    if (animalId) {
      fetch(`http://localhost:5000/api/animals/with-details?animalId=${animalId}`)
        .then(res => res.json())
        .then(data => setAnimal(data));
    }
  }, [animalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'medicineId') {
      const selected = medicines.find(m => m.id === Number(value));
      setSelectedActiveSubstance(selected ? selected.activeSubstance : '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const VeterinaryID = vet?.VeterinaryID || 1;
    const Frequency = `${formData.frequencyType} ${formData.frequencyCount} kez`;
    const payload = {
      VeterinaryID,
      AnimalID: Number(animalId),
      Method: formData.applicationMethod,
      Dose: formData.dose,
      Frequency,
      medicineId: Number(formData.medicineId),
      Disease: formData.disease
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Reçete başarıyla eklendi ve stok güncellendi!');
        setIsError(false);
        setFormData({
          disease: '',
          medicineId: '',
          dose: '',
          applicationMethod: '',
          frequencyType: '',
          frequencyCount: '',
          duration: ''
        });
      } else {
        setMessage(data.message || 'Reçete eklenemedi!');
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
              <h2 className="text-2xl font-bold text-gray-800">Reçete Oluştur</h2>
              <p className="text-sm text-gray-500">Yeni reçete bilgilerini girin</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Geri Dön
          </button>
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
            {/* Animal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Irk
                </label>
                <input
                  type="text"
                  value={animal ? animal.Breed : ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tür
                </label>
                <input
                  type="text"
                  value={animal ? animal.Type : ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            {/* Disease Selection */}
            <div>
              <label htmlFor="disease" className="block text-sm font-medium text-gray-700 mb-2">
                Hastalık İsmi
              </label>
              <select
                id="disease"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              >
                <option value="">Seçiniz</option>
                {diseases.map((disease) => (
                  <option key={disease.id} value={disease.name}>
                    {disease.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Medicine Selection */}
            <div>
              <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-2">
                İlaç İsmi
              </label>
              <select
                id="medicine"
                name="medicineId"
                value={formData.medicineId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              >
                <option value="">Seçiniz</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Etken Madde kutusu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etken Madde
              </label>
              <input
                type="text"
                name="activeSubstance"
                value={selectedActiveSubstance}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            {/* Doz */}
            <div>
              <label htmlFor="dose" className="block text-sm font-medium text-gray-700 mb-2">
                Doz
              </label>
              <input
                type="text"
                id="dose"
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                placeholder="Örn: 1 tablet"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              />
            </div>

            {/* Application Method */}
            <div>
              <label htmlFor="applicationMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Uygulama Şekli
              </label>
              <select
                id="applicationMethod"
                name="applicationMethod"
                value={formData.applicationMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              >
                <option value="">Seçiniz</option>
                {applicationMethods.map((method) => (
                  <option key={method.id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Frequency Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="frequencyType" className="block text-sm font-medium text-gray-700 mb-2">
                  Sıklık
                </label>
                <select
                  id="frequencyType"
                  name="frequencyType"
                  value={formData.frequencyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                >
                  <option value="">Seçiniz</option>
                  {frequencyTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="frequencyCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Kaç Kez
                </label>
                <input
                  type="number"
                  id="frequencyCount"
                  name="frequencyCount"
                  value={formData.frequencyCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Tedavi Süresi (Gün)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg mt-6 font-semibold"
            >
              Reçeteyi Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrescriptions;
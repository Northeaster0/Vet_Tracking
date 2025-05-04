import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
// const medicines = [
//   { id: 1, name: 'Antibiyotik X' },
//   { id: 2, name: 'Vitamin Y' },
//   { id: 3, name: 'Steroid Z' }
// ];

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
  const [medicines, setMedicines] = useState<{id:number, name:string}[]>([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

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
      .then(data => setMedicines(data.map((m: any) => ({
        id: m.id,
        name: m.Name || m.name
      }))));
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
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    const VeterinaryID = doctor.VeterinaryID || doctor.id || 1; // fallback
    const Frequency = `${formData.frequencyType} ${formData.frequencyCount} kez`;
    const payload = {
      VeterinaryID,
      AnimalID: Number(animalId),
      Method: formData.applicationMethod,
      Dose: formData.dose,
      Frequency,
      medicineId: Number(formData.medicineId)
    };
    try {
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        alert('Reçete başarıyla eklendi ve stok güncellendi!');
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
        alert(data.message || 'Reçete eklenemedi!');
      }
    } catch (err) {
      alert('Sunucuya bağlanılamadı!');
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
            Reçete Ekle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Otomatik doldurulan bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Irk
                </label>
                <input
                  type="text"
                  value="Golden Retriever"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tür
                </label>
                <input
                  type="text"
                  value="Köpek"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* Hastalık seçimi */}
            <div>
              <label htmlFor="disease" className="block text-sm font-medium text-gray-700 mb-1">
                Hastalık İsmi
              </label>
              <select
                id="disease"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* İlaç seçimi */}
            <div>
              <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-1">
                İlaç İsmi
              </label>
              <select
                id="medicine"
                name="medicineId"
                value={formData.medicineId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Doz */}
            <div>
              <label htmlFor="dose" className="block text-sm font-medium text-gray-700 mb-1">
                Doz
              </label>
              <input
                type="text"
                id="dose"
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                placeholder="Örn: 1 tablet"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Uygulama şekli */}
            <div>
              <label htmlFor="applicationMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Uygulama Şekli
              </label>
              <select
                id="applicationMethod"
                name="applicationMethod"
                value={formData.applicationMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Uygulama sıklığı */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="frequencyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Sıklık
                </label>
                <select
                  id="frequencyType"
                  name="frequencyType"
                  value={formData.frequencyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="frequencyCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Kaç Kez
                </label>
                <input
                  type="number"
                  id="frequencyCount"
                  name="frequencyCount"
                  value={formData.frequencyCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Tedavi Süresi
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mt-6"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrescriptions; 
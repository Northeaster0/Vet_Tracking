import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const diseases = [
  { id: 1, name: 'Parvovirüs' },
  { id: 2, name: 'Kuduz' },
  { id: 3, name: 'Deri Enfeksiyonu' }
];

const medicines = [
  { id: 1, name: 'Antibiyotik X' },
  { id: 2, name: 'Vitamin Y' },
  { id: 3, name: 'Steroid Z' }
];

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
    medicine: '',
    dose: '',
    applicationMethod: '',
    frequencyType: '',
    frequencyCount: '',
    duration: '',
    anamnesis: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // İleride API çağrısı yapılacak
    console.log('Reçete bilgileri:', formData);
    // Form temizleme
    setFormData({
      disease: '',
      medicine: '',
      dose: '',
      applicationMethod: '',
      frequencyType: '',
      frequencyCount: '',
      duration: '',
      anamnesis: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/patientAcception" 
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
                name="medicine"
                value={formData.medicine}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.name}>
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

            {/* Anamnez */}
            <div>
              <label htmlFor="anamnesis" className="block text-sm font-medium text-gray-700 mb-1">
                Anamnez
              </label>
              <textarea
                id="anamnesis"
                name="anamnesis"
                value={formData.anamnesis}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
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
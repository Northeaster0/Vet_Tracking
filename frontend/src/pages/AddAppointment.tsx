import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const appointmentTypes = [
  { id: 1, name: 'Aşı' },
  { id: 2, name: 'Muayene' },
  { id: 3, name: 'Operasyon' }
];

const vaccineTypes = [
  { id: 1, name: 'Karma Aşı' },
  { id: 2, name: 'Kuduz Aşısı' },
  { id: 3, name: 'Parazit Aşısı' }
];

const operationTypes = [
  { id: 1, name: 'Kısırlaştırma' },
  { id: 2, name: 'Tümör Alımı' },
  { id: 3, name: 'Diş Temizliği' }
];

const AddAppointment: React.FC = () => {
  const [formData, setFormData] = useState({
    dateTime: '',
    appointmentType: '',
    vaccineType: '',
    operationType: '',
    examinationNote: ''
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

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
    console.log('Randevu bilgileri:', formData);
    // Form temizleme
    setFormData({
      dateTime: '',
      appointmentType: '',
      vaccineType: '',
      operationType: '',
      examinationNote: ''
    });
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
            Randevu Ekle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">
                Tarih ve Saat
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-1">
                Randevu Türü
              </label>
              <select
                id="appointmentType"
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                {appointmentTypes.map(type => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Aşı seçildiğinde gösterilecek alan */}
            {formData.appointmentType === 'Aşı' && (
              <div>
                <label htmlFor="vaccineType" className="block text-sm font-medium text-gray-700 mb-1">
                  Aşı İsmi
                </label>
                <select
                  id="vaccineType"
                  name="vaccineType"
                  value={formData.vaccineType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  {vaccineTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Muayene seçildiğinde gösterilecek alan */}
            {formData.appointmentType === 'Muayene' && (
              <div>
                <label htmlFor="examinationNote" className="block text-sm font-medium text-gray-700 mb-1">
                  Muayene Notu
                </label>
                <textarea
                  id="examinationNote"
                  name="examinationNote"
                  value={formData.examinationNote}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            {/* Operasyon seçildiğinde gösterilecek alan */}
            {formData.appointmentType === 'Operasyon' && (
              <div>
                <label htmlFor="operationType" className="block text-sm font-medium text-gray-700 mb-1">
                  Operasyon Türü
                </label>
                <select
                  id="operationType"
                  name="operationType"
                  value={formData.operationType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  {operationTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mt-6"
            >
              Randevu Oluştur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment; 
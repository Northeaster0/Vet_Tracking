import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Vaccine {
  id: number;
  name: string;
  date: string;
  nextDate: string;
  status: 'Yaklaşıyor' | 'Gecikmiş' | 'Tamamlandı';
}

const DoctorVaccineStatus: React.FC = () => {
  // Örnek aşı listesi (ileride veritabanından gelecek)
  const vaccineTypes = [
    { id: 1, name: 'Kuduz Aşısı' },
    { id: 2, name: 'Karma Aşı' },
    { id: 3, name: 'Lyme Aşısı' }
  ];

  // Örnek aşı verileri
  const [vaccines, setVaccines] = useState<Vaccine[]>([
    {
      id: 1,
      name: 'Kuduz Aşısı',
      date: '2024-01-15',
      nextDate: '2024-01-15',
      status: 'Gecikmiş'
    },
    {
      id: 2,
      name: 'Karma Aşı',
      date: '2024-02-20',
      nextDate: '2024-02-20',
      status: 'Yaklaşıyor'
    },
    {
      id: 3,
      name: 'Lyme Aşısı',
      date: '2024-03-10',
      nextDate: '2024-03-10',
      status: 'Yaklaşıyor'
    }
  ]);

  const [newVaccine, setNewVaccine] = useState({
    name: '',
    date: '',
    nextDate: ''
  });

  const handleAddVaccine = () => {
    if (newVaccine.name && newVaccine.date && newVaccine.nextDate) {
      const vaccine: Vaccine = {
        id: vaccines.length + 1,
        name: newVaccine.name,
        date: newVaccine.date,
        nextDate: newVaccine.nextDate,
        status: 'Yaklaşıyor'
      };
      setVaccines([...vaccines, vaccine]);
      setNewVaccine({ name: '', date: '', nextDate: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yaklaşıyor':
        return 'bg-yellow-100 text-yellow-800';
      case 'Gecikmiş':
        return 'bg-red-100 text-red-800';
      case 'Tamamlandı':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patientAcception" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Aşı Takibi
          </h2>

          <div className="space-y-4">
            {vaccines.map((vaccine) => (
              <div key={vaccine.id} className="border rounded-lg p-4 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{vaccine.name}</h3>
                    <p className="text-sm text-gray-600">Son Aşı Tarihi: {vaccine.date}</p>
                    <p className="text-sm text-gray-600">Sonraki Aşı Tarihi: {vaccine.nextDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vaccine.status)}`}>
                    {vaccine.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Yeni Aşı Ekle
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aşı Adı
              </label>
              <select
                value={newVaccine.name}
                onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Aşı seçin</option>
                {vaccineTypes.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.name}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aşı Tarihi
              </label>
              <input
                type="date"
                value={newVaccine.date}
                onChange={(e) => setNewVaccine({ ...newVaccine, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sonraki Aşı Tarihi
              </label>
              <input
                type="date"
                value={newVaccine.nextDate}
                onChange={(e) => setNewVaccine({ ...newVaccine, nextDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddVaccine}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Aşı Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVaccineStatus; 
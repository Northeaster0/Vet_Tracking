import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const pastTests = [
  { id: 1, type: 'Hemogram', date: '2025-03-01', result: 'Normal' },
  { id: 2, type: 'Röntgen', date: '2025-02-12', result: 'Sağ arka bacakta çatlak' },
  { id: 3, type: 'Biyokimya', date: '2024-12-05', result: 'Karaciğer enzimleri yüksek' }
];

const testTypes = [
  { id: 1, name: 'Hemogram' },
  { id: 2, name: 'Röntgen' },
  { id: 3, name: 'Biyokimya' },
  { id: 4, name: 'İdrar' }
];

const Tests: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const handleTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTest(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTest) {
      setRequestMessage(`${selectedTest} test istendi`);
      setSelectedTest('');
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
            Geçmiş Tahliller
          </h2>

          <div className="space-y-4">
            {pastTests.map((test) => (
              <div 
                key={test.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {test.type}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tarih: {test.date}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {test.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Yeni Tahlil İste
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedTest}
              onChange={handleTestChange}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Tahlil Türü Seçin</option>
              {testTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Tahlil Ekle
            </button>
          </form>

          {requestMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
              {requestMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tests; 
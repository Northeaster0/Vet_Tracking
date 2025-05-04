import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const radiologyResults = [
  {
    id: 1,
    date: '2024-03-10',
    type: 'Röntgen',
    description: 'Sol arka bacakta kırık tespit edildi.',
    imageUrl: '' // örnek: '/uploads/radiology1.jpg'
  },
  {
    id: 2,
    date: '2024-02-05',
    type: 'Ultrason',
    description: 'Karaciğer boyutları normal.',
    imageUrl: ''
  }
];

const labResults = [
  {
    id: 1,
    date: '2024-03-15',
    testType: 'Kan Tahlili',
    results: [
      { parameter: 'WBC', value: '12.5', unit: '10^3/μL', normalRange: '5.5-16.5' },
      { parameter: 'RBC', value: '7.2', unit: '10^6/μL', normalRange: '5.5-8.5' },
      { parameter: 'HGB', value: '15.8', unit: 'g/dL', normalRange: '12.0-18.0' },
      { parameter: 'HCT', value: '45', unit: '%', normalRange: '37-55' }
    ],
    notes: 'Genel durum normal sınırlar içerisinde. Herhangi bir anormallik tespit edilmedi.'
  },
  {
    id: 2,
    date: '2024-02-20',
    testType: 'Biyokimya',
    results: [
      { parameter: 'Glukoz', value: '95', unit: 'mg/dL', normalRange: '70-120' },
      { parameter: 'BUN', value: '18', unit: 'mg/dL', normalRange: '10-30' },
      { parameter: 'Kreatinin', value: '1.2', unit: 'mg/dL', normalRange: '0.5-1.8' },
      { parameter: 'ALT', value: '45', unit: 'U/L', normalRange: '10-100' }
    ],
    notes: 'Karaciğer fonksiyonları normal sınırlar içerisinde. Böbrek değerleri optimal seviyede.'
  }
];

const PatientTestResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radyoloji' | 'lab'>('radyoloji');
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patient-dashboard" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Radyolojik ve Labaratuvar Sonuçları
          </h2>

          {/* Sekmeler */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('radyoloji')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'radyoloji'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Radyolojik Sonuçlar
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'lab'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Labaratuvar Sonuçları
            </button>
          </div>

          {/* Sekme İçeriği */}
          {activeTab === 'radyoloji' ? (
            <div className="space-y-6">
              {radiologyResults.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{r.type}</h3>
                      <p className="text-sm text-gray-600">Tarih: {r.date}</p>
                    </div>
                  </div>
                  <div className="mb-2 text-gray-700">{r.description}</div>
                  {/* r.imageUrl varsa burada görsel de gösterilebilir */}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {labResults.map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {test.testType}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tarih: {test.date}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Sonuçlar:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parametre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Değer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Aralık</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {test.results.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.parameter}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.value}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.unit}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.normalRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {test.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Doktor Notları:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {test.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientTestResults; 
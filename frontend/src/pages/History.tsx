import React from 'react';
import { Link } from 'react-router-dom';

// Örnek geçmiş işlem verileri (ileride veritabanından gelecek)
const historyItems = [
  { 
    id: 1,
    animalName: 'Pamuk',
    date: '2024-11-12',
    process: 'Aşı uygulandı'
  },
  { 
    id: 2,
    animalName: 'Karabaş',
    date: '2025-01-03',
    process: 'Reçete yazıldı'
  },
  { 
    id: 3,
    animalName: 'Tekir',
    date: '2025-03-21',
    process: 'Kan tahlili yapıldı'
  }
];

const History: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Geçmiş İşlemler
          </h2>

          <div className="space-y-4">
            {historyItems.map((item) => (
              <div 
                key={item.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Hayvan İsmi</span>
                    <p className="font-semibold text-gray-800">{item.animalName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tarih</span>
                    <p className="font-semibold text-gray-800">{item.date}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">İşlem</span>
                    <p className="font-semibold text-blue-600">{item.process}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History; 
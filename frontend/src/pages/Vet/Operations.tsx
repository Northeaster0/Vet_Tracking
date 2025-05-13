import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Operations: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  
  const [operations, setOperations] = useState<any[]>([]);
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (animalId) {
      fetch(`http://localhost:5000/api/operations?animalId=${animalId}`)
        .then(res => res.json())
        .then(data => setOperations(data));
    }
  }, [animalId]);

  if (!animalId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600">Hayvan seçilmedi</h2>
            <p className="text-gray-600 mt-2">Lütfen bir hayvan seçerek tekrar deneyin.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!desc || !date) {
      setMessage('Tüm alanları doldurun!');
      return;
    }
    const response = await fetch('http://localhost:5000/api/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animalId, description: desc, date })
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Operasyon eklendi!');
      setDesc('');
      setDate('');
      setOperations(prev => [...prev, { OpDetail: desc, CreatedAt: date }]);
    } else {
      setMessage(data.message || 'Operasyon eklenemedi!');
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
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">⚕️</span> Geçmiş Operasyonlar
              </h2>
              <p className="text-sm text-gray-500">Hayvanın geçmiş operasyonlarını görüntüleyin ve yeni operasyon ekleyin</p>
            </div>
          </div>
          <Link
            to={`/patientAcception?animalId=${animalId}`}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 rounded-xl text-center font-semibold bg-green-100 text-green-800">
            {message}
          </div>
        )}

        {/* Operations List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Operasyon Geçmişi</h3>
          <div className="space-y-4">
            {operations.length === 0 ? (
              <div className="text-center text-gray-500">Operasyon kaydı yok.</div>
            ) : (
              operations.map((op, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-[#d68f13] transition duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Tarih</span>
                      <p className="font-semibold text-gray-800">{op.CreatedAt}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Açıklama</span>
                      <p className="font-semibold text-[#d68f13]">{op.OpDetail}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Operation Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Yeni Operasyon Ekle</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg font-semibold"
            >
              Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Operations; 
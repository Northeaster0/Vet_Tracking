import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

interface Anamnez {
  AnamnezID: number;
  AnimalID: number;
  VeterinaryID: number;
  Detail: string;
  CreatedAt: string;
}

const Anamnezs: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

  const [anamnezs, setAnamnezs] = useState<Anamnez[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState('');
  const [addMsg, setAddMsg] = useState('');

  const fetchAnamnezs = async () => {
    if (!animalId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/anamnezs?animalId=${animalId}`);
      const data = await res.json();
      setAnamnezs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Anamnezler getirilemedi!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnamnezs();
    // eslint-disable-next-line
  }, [animalId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg('');
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    const veterinaryId = doctor.VeterinaryID || doctor.id || 1;
    try {
      const res = await fetch('http://localhost:5000/api/anamnezs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalId, veterinaryId, detail })
      });
      const data = await res.json();
      if (data.success) {
        setAddMsg('Anamnez başarıyla eklendi!');
        setDetail('');
        fetchAnamnezs();
      } else {
        setAddMsg(data.error || 'Ekleme başarısız!');
      }
    } catch (err) {
      setAddMsg('Sunucuya bağlanılamadı!');
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
                <span className="mr-2">📝</span> Anamnezler
              </h2>
              <p className="text-sm text-gray-500">Hayvanın geçmiş anamnez kayıtlarını görüntüleyin ve yeni ekleyin</p>
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
        {addMsg && <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-800 text-center font-semibold">{addMsg}</div>}
        {error && <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-800 text-center font-semibold">{error}</div>}

        {/* Anamnez Listesi */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
            <span className="mr-2">📋</span> Anamnez Kayıtları
          </h3>
          {loading ? (
            <div className="text-blue-900 text-center">Yükleniyor...</div>
          ) : anamnezs.length === 0 ? (
            <div className="text-gray-400 text-center text-lg">Mevcut anamnez yok.</div>
          ) : (
            <div className="space-y-6">
              {anamnezs.map((a) => (
                <div key={a.AnamnezID} className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5 flex flex-col gap-2">
                  <div className="text-lg font-semibold text-blue-900">{a.Detail}</div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                    <span>Oluşturulma: {new Date(a.CreatedAt).toLocaleString('tr-TR')}</span>
                    {a.VeterinaryID && <span>Veteriner ID: {a.VeterinaryID}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Yeni Anamnez Ekle */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center">
              <span className="mr-2">➕</span> Yeni Anamnez Ekle
            </h3>
            <textarea
              value={detail}
              onChange={e => setDetail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              rows={3}
              placeholder="Anamnez notunu buraya yazın..."
              required
            />
            <button
              type="submit"
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg font-semibold text-lg"
              disabled={!detail}
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Anamnezs; 
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Anamnezler</h2>
        <div className="mb-10">
          {loading ? (
            <div className="text-blue-900 text-center">Yükleniyor...</div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
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
        <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-xl flex flex-col gap-4 shadow-inner">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Yeni Anamnez Ekle</h3>
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
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-lg"
            disabled={!detail}
          >
            Anamnez Ekle
          </button>
          {addMsg && <div className="text-center text-blue-900 font-semibold mt-2">{addMsg}</div>}
        </form>
      </div>
    </div>
  );
};

export default Anamnezs; 
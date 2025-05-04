import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Hayvan seçilmedi. Lütfen bir hayvan seçerek tekrar deneyin.</div>;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Geçmiş Operasyonlar</h2>
        <ul className="mb-8">
          {operations.length === 0 && <li>Operasyon kaydı yok.</li>}
          {operations.map((op, i) => (
            <li key={i} className="mb-2 p-3 bg-white rounded shadow">
              <span className="font-semibold">Tarih:</span> {op.CreatedAt} <br/>
              <span className="font-semibold">Açıklama:</span> {op.OpDetail}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow space-y-4">
          <h3 className="font-bold text-lg">Yeni Operasyon Ekle</h3>
          <div>
            <label className="block mb-1">Tarih</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded px-2 py-1 w-full" required />
          </div>
          <div>
            <label className="block mb-1">Açıklama</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} className="border rounded px-2 py-1 w-full" required />
          </div>
          {message && <div className="text-sm text-center text-blue-700">{message}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ekle</button>
        </form>
      </div>
    </div>
  );
};

export default Operations; 
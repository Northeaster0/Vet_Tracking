import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
}

interface MedicineItem {
  id: number;
  name: string;
}

const ViewStocks: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [medicineList, setMedicineList] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addForm, setAddForm] = useState({ medicineId: '', quantity: '' });
  const [reduceForm, setReduceForm] = useState({ medicineId: '', quantity: '' });
  const [formMessage, setFormMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReduceModal, setShowReduceModal] = useState(false);

  const fetchStocks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/medicine-stocks');
      const data = await response.json();
      setStockItems(data);
      setLoading(false);
    } catch (err) {
      setError('Stoklar getirilemedi!');
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/medicines');
      const data = await response.json();
      setMedicineList(data);
    } catch (err) {
      // hata gösterme
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchMedicines();
  }, []);

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReduceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReduceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/medicine-stocks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineId: Number(addForm.medicineId),
          quantity: Number(addForm.quantity)
        })
      });
      const data = await response.json();
      if (data.success) {
        setFormMessage('Stok başarıyla eklendi!');
        setAddForm({ medicineId: '', quantity: '' });
        fetchStocks();
        setShowAddModal(false);
      } else {
        setFormMessage(data.message || 'Stok eklenemedi!');
      }
    } catch (err) {
      setFormMessage('Sunucuya bağlanılamadı!');
    }
  };

  const handleReduceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/medicine-stocks/reduce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineId: Number(reduceForm.medicineId),
          quantity: Number(reduceForm.quantity)
        })
      });
      const data = await response.json();
      if (data.success) {
        setFormMessage('Stok başarıyla eksiltildi!');
        setReduceForm({ medicineId: '', quantity: '' });
        fetchStocks();
        setShowReduceModal(false);
      } else {
        setFormMessage(data.message || 'Stok eksiltilemedi!');
      }
    } catch (err) {
      setFormMessage('Sunucuya bağlanılamadı!');
    }
  };

  // Arama filtresi
  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto relative">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        {/* Arama Çubuğu */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="İlaç ismine göre ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-blue-900 flex-shrink-0">
              Stok Durumu
            </h2>
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={() => { setShowAddModal(true); setFormMessage(''); }}
                className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg hover:bg-green-700 transition duration-300"
                title="Stok Ekle"
              >
                <span className="text-white text-3xl font-bold leading-none">+</span>
              </button>
              <button
                onClick={() => { setShowReduceModal(true); setFormMessage(''); }}
                className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-700 transition duration-300"
                title="Stok Eksilt"
              >
                <span className="text-white text-3xl font-bold leading-none">-</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-blue-900">Yükleniyor...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="space-y-4">
              {filteredStockItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <span className="text-blue-600 font-bold">
                      {item.quantity} adet
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stok Ekle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-900 mb-6">Stok Ekle</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlaç Seç
                  </label>
                  <select
                    name="medicineId"
                    value={addForm.medicineId}
                    onChange={handleAddChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">İlaç seçiniz</option>
                    {medicineList.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miktar
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={addForm.quantity}
                    onChange={handleAddChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 mt-6"
                >
                  Stok Ekle
                </button>
                {formMessage && (
                  <div className="mt-2 text-center text-blue-900 font-semibold">{formMessage}</div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Stok Eksilt Modal */}
        {showReduceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowReduceModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-900 mb-6">Stok Eksilt</h2>
              <form onSubmit={handleReduceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlaç Seç
                  </label>
                  <select
                    name="medicineId"
                    value={reduceForm.medicineId}
                    onChange={handleReduceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">İlaç seçiniz</option>
                    {stockItems.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miktar
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={reduceForm.quantity}
                    onChange={handleReduceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 mt-6"
                >
                  Stok Eksilt
                </button>
                {formMessage && (
                  <div className="mt-2 text-center text-blue-900 font-semibold">{formMessage}</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStocks; 
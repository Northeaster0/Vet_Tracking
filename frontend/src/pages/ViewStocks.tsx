import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  PurchasePrice?: number;
  SalePrice?: number;
}

interface MedicineItem {
  id: number;
  name: string;
}

interface VaccineItem {
  id: number;
  name: string;
}

const ViewStocks: React.FC = () => {
  const [stockType, setStockType] = useState<'medicine' | 'vaccine'>('medicine');
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [medicineList, setMedicineList] = useState<MedicineItem[]>([]);
  const [vaccineList, setVaccineList] = useState<VaccineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addForm, setAddForm] = useState({ itemId: '', quantity: '' });
  const [reduceForm, setReduceForm] = useState({ itemId: '', quantity: '' });
  const [formMessage, setFormMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReduceModal, setShowReduceModal] = useState(false);

  // Stokları getir
  const fetchStocks = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (stockType === 'medicine') {
        const response = await fetch('http://localhost:5000/api/medicine-stocks');
        data = await response.json();
      } else {
        const response = await fetch('http://localhost:5000/api/vaccine-stocks');
        data = await response.json();
      }
      setStockItems(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError('Stoklar getirilemedi!');
      setStockItems([]);
      setLoading(false);
    }
  };

  // İlaç ve aşı listelerini getir
  const fetchLists = async () => {
    if (stockType === 'medicine') {
      const response = await fetch('http://localhost:5000/api/medicines');
      const data = await response.json();
      setMedicineList(data);
    } else {
      const response = await fetch('http://localhost:5000/api/vaccines');
      const data = await response.json();
      setVaccineList(data.map((v: any) => ({ id: v.id, name: v.Name || v.name })));
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchLists();
    setAddForm({ itemId: '', quantity: '' });
    setReduceForm({ itemId: '', quantity: '' });
    setFormMessage('');
  }, [stockType]);

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
      let url = '';
      let body: any = {};
      if (stockType === 'medicine') {
        url = 'http://localhost:5000/api/medicine-stocks/add';
        body = { medicineId: Number(addForm.itemId), quantity: Number(addForm.quantity) };
      } else {
        url = 'http://localhost:5000/api/vaccine-stocks/add';
        body = { vaccineId: Number(addForm.itemId), quantity: Number(addForm.quantity) };
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.success) {
        setFormMessage('Stok başarıyla eklendi!');
        setAddForm({ itemId: '', quantity: '' });
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
      let url = '';
      let body: any = {};
      if (stockType === 'medicine') {
        url = 'http://localhost:5000/api/medicine-stocks/reduce';
        body = { medicineId: Number(reduceForm.itemId), quantity: Number(reduceForm.quantity) };
      } else {
        url = 'http://localhost:5000/api/vaccine-stocks/reduce';
        body = { vaccineId: Number(reduceForm.itemId), quantity: Number(reduceForm.quantity) };
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.success) {
        setFormMessage('Stok başarıyla eksiltildi!');
        setReduceForm({ itemId: '', quantity: '' });
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

        {/* Stok Tipi Seçimi */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold text-blue-900">Stok Tipi:</label>
          <select
            value={stockType}
            onChange={e => setStockType(e.target.value as 'medicine' | 'vaccine')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="medicine">İlaç Stoku</option>
            <option value="vaccine">Aşı Stoku</option>
          </select>
        </div>

        {/* Arama Çubuğu */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={stockType === 'medicine' ? 'İlaç ismine göre ara...' : 'Aşı ismine göre ara...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-blue-900 flex-shrink-0">
              {stockType === 'medicine' ? 'İlaç Stok Durumu' : 'Aşı Stok Durumu'}
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
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <span className="text-blue-600 font-bold">{item.quantity} adet</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-sm text-gray-700 ml-4">
                      <span>Alış: <span className="font-semibold">{item.PurchasePrice ?? '-'}</span> ₺</span>
                      <span>Satış: <span className="font-semibold">{item.SalePrice ?? '-'}</span> ₺</span>
                    </div>
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
                    {stockType === 'medicine' ? 'İlaç Seç' : 'Aşı Seç'}
                  </label>
                  <select
                    name="itemId"
                    value={addForm.itemId}
                    onChange={handleAddChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">{stockType === 'medicine' ? 'İlaç seçiniz' : 'Aşı seçiniz'}</option>
                    {(stockType === 'medicine' ? medicineList : vaccineList).map(item => (
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
                    {stockType === 'medicine' ? 'İlaç Seç' : 'Aşı Seç'}
                  </label>
                  <select
                    name="itemId"
                    value={reduceForm.itemId}
                    onChange={handleReduceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">{stockType === 'medicine' ? 'İlaç seçiniz' : 'Aşı seçiniz'}</option>
                    {(stockType === 'medicine' ? medicineList : vaccineList).map(item => (
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
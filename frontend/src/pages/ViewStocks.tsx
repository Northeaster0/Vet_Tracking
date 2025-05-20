import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Stok öğesi için tip tanımı
interface StockItem {
  id: number;
  name: string;
  quantity: number;
  PurchasePrice?: number;
  SalePrice?: number;
}

// İlaç öğesi için tip tanımı
interface MedicineItem {
  id: number;
  name: string;
}

// Aşı öğesi için tip tanımı
interface VaccineItem {
  id: number;
  name: string;
}

const ViewStocks: React.FC = () => {
  const navigate = useNavigate();
  // State tanımlamaları
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

  // Stokları getiren fonksiyon
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

  // İlaç ve aşı listelerini getiren fonksiyon
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

  // Stok tipi değiştiğinde verileri yeniden yükle
  useEffect(() => {
    fetchStocks();
    fetchLists();
    setAddForm({ itemId: '', quantity: '' });
    setReduceForm({ itemId: '', quantity: '' });
    setFormMessage('');
  }, [stockType]);

  // Stok ekleme formu değişikliklerini yöneten fonksiyon
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // Stok eksiltme formu değişikliklerini yöneten fonksiyon
  const handleReduceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReduceForm(prev => ({ ...prev, [name]: value }));
  };

  // Stok ekleme işlemini gerçekleştiren fonksiyon
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

  // Stok eksiltme işlemini gerçekleştiren fonksiyon
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Başlık Bölümü */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📦</span> Stok Durumu
              </h2>
              <p className="text-sm text-gray-500">İlaç ve aşı stokları</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Stok Tipi Seçimi ve Arama Bölümü */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-6 flex items-center gap-4">
            <label className="font-semibold text-gray-800">Stok Tipi:</label>
            <select
              value={stockType}
              onChange={e => setStockType(e.target.value as 'medicine' | 'vaccine')}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
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
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
            />
          </div>

          {/* Stok Başlığı ve İşlem Butonları */}
          <div className="flex flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex-shrink-0">
              {stockType === 'medicine' ? 'İlaç Stok Durumu' : 'Aşı Stok Durumu'}
            </h2>
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={() => { setShowAddModal(true); setFormMessage(''); }}
                className="w-14 h-14 rounded-xl bg-[#d68f13] flex items-center justify-center shadow-lg hover:bg-[#b8770f] transition duration-300 transform hover:scale-105"
                title="Stok Ekle"
              >
                <span className="text-white text-3xl font-bold leading-none">+</span>
              </button>
              <button
                onClick={() => { setShowReduceModal(true); setFormMessage(''); }}
                className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
                title="Stok Eksilt"
              >
                <span className="text-white text-3xl font-bold leading-none">-</span>
              </button>
            </div>
          </div>

          {/* Stok Listesi */}
          {loading ? (
            <div className="text-gray-500">Yükleniyor...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="space-y-4">
              {filteredStockItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition duration-300 transform hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <span className="text-[#d68f13] font-bold">{item.quantity} adet</span>
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
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Stok Ekle</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {stockType === 'medicine' ? 'İlaç Seç' : 'Aşı Seç'}
                  </label>
                  <select
                    name="itemId"
                    value={addForm.itemId}
                    onChange={handleAddChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                    required
                    min="1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#d68f13] text-white py-3 rounded-xl font-semibold hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg mt-6"
                >
                  Stok Ekle
                </button>
                {formMessage && (
                  <div className="mt-2 text-center text-gray-800 font-semibold">{formMessage}</div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Stok Eksilt Modal */}
        {showReduceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowReduceModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Stok Eksilt</h2>
              <form onSubmit={handleReduceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {stockType === 'medicine' ? 'İlaç Seç' : 'Aşı Seç'}
                  </label>
                  <select
                    name="itemId"
                    value={reduceForm.itemId}
                    onChange={handleReduceChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                    required
                    min="1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition duration-300 transform hover:scale-105 shadow-lg mt-6"
                >
                  Stok Eksilt
                </button>
                {formMessage && (
                  <div className="mt-2 text-center text-gray-800 font-semibold">{formMessage}</div>
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
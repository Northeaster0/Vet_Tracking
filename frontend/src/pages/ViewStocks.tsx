import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Örnek stok verileri (ileride veritabanından gelecek)
const stockItems = [
  { id: 1, name: 'Antibiyotik-X', quantity: 25 },
  { id: 2, name: 'Aşı-Y', quantity: 40 },
  { id: 3, name: 'Vitamin-Z', quantity: 12 }
];

const ViewStocks: React.FC = () => {
  const [newStock, setNewStock] = useState({
    name: '',
    quantity: ''
  });

  const [reduceStock, setReduceStock] = useState({
    name: '',
    quantity: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'add' | 'reduce') => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewStock(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setReduceStock(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent, formType: 'add' | 'reduce') => {
    e.preventDefault();
    if (formType === 'add') {
      // İleride API çağrısı yapılacak
      console.log('Yeni stok eklendi:', newStock);
      setNewStock({ name: '', quantity: '' });
    } else {
      // İleride API çağrısı yapılacak
      console.log('Stok eksiltildi:', reduceStock);
      setReduceStock({ name: '', quantity: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Stok Durumu
          </h2>

          <div className="space-y-4">
            {stockItems.map((item) => (
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
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Stok Ekle
          </h2>

          <form onSubmit={(e) => handleSubmit(e, 'add')} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                İlaç İsmi
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newStock.name}
                onChange={(e) => handleChange(e, 'add')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Miktar
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newStock.quantity}
                onChange={(e) => handleChange(e, 'add')}
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
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Stok Eksilt
          </h2>

          <form onSubmit={(e) => handleSubmit(e, 'reduce')} className="space-y-4">
            <div>
              <label htmlFor="reduce-name" className="block text-sm font-medium text-gray-700 mb-1">
                İlaç İsmi
              </label>
              <input
                type="text"
                id="reduce-name"
                name="name"
                value={reduceStock.name}
                onChange={(e) => handleChange(e, 'reduce')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="reduce-quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Miktar
              </label>
              <input
                type="number"
                id="reduce-quantity"
                name="quantity"
                value={reduceStock.quantity}
                onChange={(e) => handleChange(e, 'reduce')}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewStocks; 